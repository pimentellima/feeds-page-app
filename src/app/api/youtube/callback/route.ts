import { db } from '@/drizzle/index'
import { integrationTokens, users } from '@/drizzle/schema'
import { auth } from '@/lib/auth'
import { oauth2Client } from '@/lib/google-oauth-client'
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

        const {
            tokens: { access_token, expiry_date, refresh_token },
        } = await oauth2Client.getToken(code)

        if (!access_token || !expiry_date) {
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_URL}/error-linking-account`
            )
        }

        await db
            .insert(integrationTokens)
            .values({
                accessToken: access_token,
                expiresAt: new Date(expiry_date),
                refreshToken: refresh_token,
                type: 'youtubeIntegration',
                userId: session.user.id,
            })
            .onConflictDoUpdate({
                target: [integrationTokens.userId, integrationTokens.type],
                set: {
                    accessToken: access_token,
                    expiresAt: new Date(expiry_date),
                    refreshToken: refresh_token,
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
