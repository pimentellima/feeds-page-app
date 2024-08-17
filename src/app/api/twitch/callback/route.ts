import { db } from '@/drizzle/index'
import { integrationTokens, users, widgets } from '@/drizzle/schema'
import { auth } from '@/lib/auth'
import { encodeBody } from '@/lib/encode-body'
import { and, eq } from 'drizzle-orm'
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

        const response = await fetch('https://id.twitch.tv/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: encodeBody({
                client_id: process.env.TWITCH_CLIENT_ID!,
                client_secret: process.env.TWITCH_CLIENT_SECRET!,
                code,
                grant_type: 'authorization_code',
                redirect_uri: `${process.env.NEXT_PUBLIC_URL}/api/twitch/callback`,
            }),
        })
        const data = (await response.json()) as {
            access_token: string
            expires_in: number
            refresh_token: string
        }
        if (!data.access_token) {
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_URL}/error-linking-account`
            )
        }
        await db
            .insert(integrationTokens)
            .values({
                accessToken: data.access_token,
                expiresAt: new Date(Date.now() + data.expires_in * 1000),
                refreshToken: data.refresh_token,
                type: 'twitchIntegration',
                userId: session.user.id,
            })
            .onConflictDoUpdate({
                target: [integrationTokens.userId, integrationTokens.type],
                set: {
                    accessToken: data.access_token,
                    expiresAt: new Date(Date.now() + data.expires_in * 1000),
                    refreshToken: data.refresh_token,
                },
            })

        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_URL}/profile/customize`
        )
    } catch (e) {
        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_URL}/error-linking-account`
        )
    }
}

export { handler as GET, handler as POST }
