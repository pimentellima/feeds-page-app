import { db } from '@/drizzle/index'
import { integrationTokens, users } from '@/drizzle/schema'
import { auth } from '@/lib/auth'
import { encodeBody } from '@/lib/encode-body'
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

        const shortLivedTokenResponse = await fetch(
            'https://api.instagram.com/oauth/access_token',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: encodeBody({
                    client_id: process.env.INSTAGRAM_APP_ID!,
                    client_secret: process.env.INSTAGRAM_APP_SECRET!,
                    code,
                    grant_type: 'authorization_code',
                    redirect_uri: `${process.env.NEXT_PUBLIC_URL}/api/ig/callback`,
                }),
            }
        )
        const shortLivedTokenJson = (await shortLivedTokenResponse.json()) as {
            access_token: string
        }

        if (!shortLivedTokenJson.access_token) {
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_URL}/error-linking-account`
            )
        }

        const longLivedTokenResponse = await fetch(
            `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${encodeURIComponent(
                process.env.INSTAGRAM_APP_SECRET!
            )}&access_token=${encodeURIComponent(
                shortLivedTokenJson.access_token
            )}`,
            {
                method: 'GET',
            }
        )

        const longLivedTokenJson = (await longLivedTokenResponse.json()) as {
            access_token: string
            expires_in: number
        }

        if (!longLivedTokenJson.access_token) {
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_URL}/error-linking-account`
            )
        }
        await db
            .insert(integrationTokens)
            .values({
                accessToken: longLivedTokenJson.access_token,
                expiresAt: new Date(
                    Date.now() + longLivedTokenJson.expires_in * 1000
                ),
                type: 'instagramIntegration',
                userId: session.user.id,
            })
            .onConflictDoUpdate({
                target: [integrationTokens.userId, integrationTokens.type],
                set: {
                    accessToken: longLivedTokenJson.access_token,
                    expiresAt: new Date(
                        Date.now() + longLivedTokenJson.expires_in * 1000
                    ),
                },
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
