import { db } from '@/drizzle/index'
import { accountLinks, users } from '@/drizzle/schema'
import { auth } from '@/lib/auth'
import { eq } from 'drizzle-orm'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const handler = async (req: NextRequest, res: NextResponse) => {
    try {
        const session = await auth()
        const userId = session?.user.id
        if (!userId) return NextResponse.redirect('/sign-in')

        const url = new URL(req.url)

        const queryParams = new URLSearchParams(url.search)

        const code = queryParams.get('code')
        const state = queryParams.get('state')

        const cookieCsrf = cookies().get('csrfState')

        if (cookieCsrf?.value !== state) {
            return NextResponse.json(
                { error: 'Invalid CSRF token' },
                { status: 400 }
            )
        }
        if (!code)
            return NextResponse.json({ error: 'Invalid code' }, { status: 400 })
        const body = {
            client_key: process.env.TIKTOK_CLIENT_ID!,
            client_secret: process.env.TIKTOK_CLIENT_SECRET!,
            code,
            grant_type: 'authorization_code',
            redirect_uri: `${process.env.NEXT_PUBLIC_URL}/api/tiktok/callback`,
        }
        const bodyEncoded = Object.keys(body)
            .map(
                (key) =>
                    `${encodeURIComponent(key)}=${encodeURIComponent(
                        (body as any)[key]
                    )}`
            )
            .join('&')

        const response = await fetch(
            'https://open.tiktokapis.com/v2/oauth/token/',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: bodyEncoded,
            }
        )
        const data = (await response.json()) as {
            access_token: string
            expires_in: number
            open_id: string
            refresh_expires_in: number
            refresh_token: string
            scope: string
            token_type: string
        }
        if (!data.access_token) {
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_URL}/error-linking-account`
            )
        }
        const userAccountLinks = await db.query.accountLinks.findMany({
            where: eq(accountLinks.userId, userId),
        })
        const tiktokAccountLinkIndex = userAccountLinks.findIndex(
            (accountLink) => accountLink.type === 'tiktok'
        )
        if (tiktokAccountLinkIndex !== -1) {
            const accountLinkId = userAccountLinks[tiktokAccountLinkIndex].id
            await db
                .update(accountLinks)
                .set({
                    accessToken: data.access_token,
                    expiresIn: data.expires_in,
                    refreshToken: data.refresh_token,
                    refresh_expires_in: data.refresh_expires_in,
                    type: 'tiktok',
                    userId,
                })
                .where(eq(accountLinks.id, accountLinkId))
        } else {
            await db.insert(accountLinks).values({
                accessToken: data.access_token,
                expiresIn: data.expires_in,
                refreshToken: data.refresh_token,
                refresh_expires_in: data.refresh_expires_in,
                type: 'tiktok',
                userId,
            })
        }

        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_URL}/profile/customize`
        )
    } catch (e) {
        console.log(e)
        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_URL}/error-linking-account`
        )
    }
}

export { handler as GET, handler as POST }
