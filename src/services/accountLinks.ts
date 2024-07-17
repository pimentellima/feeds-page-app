import { db } from '@/drizzle/index'
import { accountLinks } from '@/drizzle/schema'
import { encodeBody } from '@/lib/encode-body'
import { eq, InferSelectModel } from 'drizzle-orm'

export async function refreshAccountLinkAccessToken(
    token: InferSelectModel<typeof accountLinks>
) {
    if (token.type === 'tiktok') {
        const response = await fetch(
            'https://open.tiktokapis.com/v2/oauth/token/',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: encodeBody({
                    client_key: process.env.TIKTOK_CLIENT_ID!,
                    client_secret: process.env.TIKTOK_CLIENT_SECRET!,
                    grant_type: 'refresh_token',
                    refresh_token: token.refreshToken as string,
                }),
            }
        )
        const responseJson = (await response.json()) as {
            access_token: string
            expires_in: number
            open_id: string
            refresh_expires_in: number
            refresh_token: string
            scope: string
            token_type: string
        }
        const expiresInMs = responseJson.expires_in * 1000
        const refreshExpiresInMs = responseJson.refresh_expires_in * 1000

        const [newToken] = await db
            .update(accountLinks)
            .set({
                accessToken: responseJson.access_token,
                expiresAt: new Date(Date.now() + expiresInMs),
                refreshToken: responseJson.refresh_token,
                refreshExpiresAt: new Date(Date.now() + refreshExpiresInMs),
            })
            .where(eq(accountLinks.id, token.id))
            .returning()
        return newToken
    }

    if (token.type === 'instagram') {
        const response = await fetch(
            'https://graph.instagram.com/refresh_access_token',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    client_secret: process.env.INSTAGRAM_APP_SECRET!,
                    access_token: token.accessToken,
                    grant_type: 'ig_refresh_token',
                }),
            }
        )
        const responseJson = (await response.json()) as {
            access_token: string
            expires_in: number
        }
        const [newToken] = await db
            .update(accountLinks)
            .set({
                accessToken: responseJson.access_token,
                expiresAt: new Date(
                    Date.now() + responseJson.expires_in * 1000
                ),
            })
            .where(eq(accountLinks.id, token.id))
            .returning()
        return newToken
    }
    return null
}
