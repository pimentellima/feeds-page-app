import { db } from '@/drizzle/index'
import { integrationTokens } from '@/drizzle/schema'
import { auth } from '@/lib/auth'
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

        const body = new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: `${process.env.NEXT_PUBLIC_URL}/api/pinterest/callback`,
        })

        const tokenResponse = await fetch(
            'https://api.pinterest.com/v5/oauth/token',
            {
                method: 'POST',
                headers: {
                    Authorization:
                        'Basic ' +
                        Buffer.from(
                            `${process.env.PINTEREST_CLIENT_ID}:${process.env.PINTEREST_CLIENT_SECRET}`
                        ).toString('base64'),
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body,
            }
        )
        const token = (await tokenResponse.json()) as {
            access_token: string
            refresh_token: string
            expires_in: 2592000
            refresh_token_expires_in: 31536000
        }

        if (!token.access_token) {
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_URL}/error-linking-account`
            )
        }

        await db.insert(integrationTokens).values({
            accessToken: token.access_token,
            refreshToken: token.refresh_token,
            expiresAt: new Date(Date.now() + token.expires_in * 1000),
            refreshExpiresAt: new Date(
                Date.now() + token.refresh_token_expires_in * 1000
            ),
            type: 'pinterestIntegration',
            userId: session.user.id,
        })

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
