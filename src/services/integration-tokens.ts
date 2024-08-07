import { db } from '@/drizzle/index'
import { integrationTokens } from '@/drizzle/schema'
import { encodeBody } from '@/lib/encode-body'
import { oauth2Client } from '@/lib/google-oauth-client'
import { and, eq, InferSelectModel } from 'drizzle-orm'
import 'server-only'

export async function refreshInstagramAccessToken(
    token: InferSelectModel<typeof integrationTokens>
) {
    if (token.expiresAt && token.expiresAt < new Date()) {
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
            .update(integrationTokens)
            .set({
                accessToken: responseJson.access_token,
                expiresAt: new Date(
                    Date.now() + responseJson.expires_in * 1000
                ),
            })
            .where(eq(integrationTokens.id, token.id))
            .returning()
        return newToken.accessToken
    }
    return token.accessToken
}

export async function getInstagramAccessToken(userId: string) {
    try {
        const token = await db.query.integrationTokens.findFirst({
            where: and(
                eq(integrationTokens.type, 'instagramIntegration'),
                eq(integrationTokens.userId, userId)
            ),
        })
        if (!token) return null
        return await refreshInstagramAccessToken(token)
    } catch (e) {
        console.log(e)
        return null
    }
}

export async function refreshYoutubeAccessToken(
    token: InferSelectModel<typeof integrationTokens>
) {
    if (token.expiresAt && token.expiresAt < new Date()) {
        oauth2Client.setCredentials({
            refresh_token: token.refreshToken,
        })
        const oauth2Response = await oauth2Client.refreshAccessToken()
        const { access_token, expiry_date } = oauth2Response.credentials
        if (!access_token || !expiry_date) {
            await db
                .delete(integrationTokens)
                .where(eq(integrationTokens.id, token.id))
            return null
        }
        const [newToken] = await db
            .update(integrationTokens)
            .set({
                accessToken: access_token,
                expiresAt: new Date(expiry_date),
            })
            .where(eq(integrationTokens.id, token.id))
            .returning()
        if (!newToken) return null
        return newToken.accessToken
    }
    return token.accessToken
}

export async function getYoutubeAccessToken(userId: string) {
    try {
        const token = await db.query.integrationTokens.findFirst({
            where: and(
                eq(integrationTokens.type, 'youtubeIntegration'),
                eq(integrationTokens.userId, userId)
            ),
        })
        if (!token) return null
        return await refreshYoutubeAccessToken(token)
    } catch (e) {
        console.log(e)
        return null
    }
}

export async function refreshTiktokAccessToken(
    token: InferSelectModel<typeof integrationTokens>
) {
    if (token.expiresAt && token.expiresAt < new Date()) {
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
            .update(integrationTokens)
            .set({
                accessToken: responseJson.access_token,
                expiresAt: new Date(Date.now() + expiresInMs),
                refreshToken: responseJson.refresh_token,
                refreshExpiresAt: new Date(Date.now() + refreshExpiresInMs),
            })
            .where(eq(integrationTokens.id, token.id))
            .returning()
        return newToken.accessToken
    }
    return token.accessToken
}

export async function getTiktokAccessToken(userId: string) {
    try {
        const token = await db.query.integrationTokens.findFirst({
            where: and(
                eq(integrationTokens.type, 'tiktokIntegration'),
                eq(integrationTokens.userId, userId)
            ),
        })
        if (!token) return null
        return await refreshTiktokAccessToken(token)
    } catch (e) {
        console.log(e)
        return null
    }
}

export async function refreshSpotifyAccessToken(
    token: InferSelectModel<typeof integrationTokens>
) {
    if (token.expiresAt && token.expiresAt < new Date(Date.now())) {
        if (!token.refreshToken) throw new Error('No refresh token')
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization:
                    'Basic ' +
                    Buffer.from(
                        process.env.SPOTIFY_CLIENT_ID +
                            ':' +
                            process.env.SPOTIFY_CLIENT_SECRET
                    ).toString('base64'),
            },
            body: encodeBody({
                grant_type: 'refresh_token',
                refresh_token: token.refreshToken,
            }),
        })
        const responseJson = (await response.json()) as {
            access_token: string
            expires_in: number
            refresh_token: string
        }
        const expiresInMs = responseJson.expires_in * 1000

        const [newToken] = await db
            .update(integrationTokens)
            .set({
                accessToken: responseJson.access_token,
                expiresAt: new Date(Date.now() + expiresInMs),
                refreshToken: responseJson.refresh_token,
            })
            .where(eq(integrationTokens.id, token.id))
            .returning()
        return newToken.accessToken
    }
    return token.accessToken
}

export async function getSpotifyAccessToken(userId: string) {
    try {
        const token = await db.query.integrationTokens.findFirst({
            where: and(
                eq(integrationTokens.type, 'spotifyIntegration'),
                eq(integrationTokens.userId, userId)
            ),
        })
        if (!token) return null
        return await refreshSpotifyAccessToken(token)
    } catch (e) {
        console.log(e)
        return null
    }
}

export async function refreshPinterestAccessToken(
    token: InferSelectModel<typeof integrationTokens>
) {
    if (token.expiresAt && token.expiresAt < new Date()) {
        const response = await fetch(
            'https://api.pinterest.com/v1/oauth/token',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: encodeBody({
                    grant_type: 'refresh_token',
                    client_id: process.env.PINTEREST_CLIENT_ID!,
                    client_secret: process.env.PINTEREST_CLIENT_SECRET!,
                    refresh_token: token.refreshToken as string,
                }),
            }
        )
        const responseJson = (await response.json()) as {
            access_token: string
            token_type: string
            scope: string
            expires_in: number
        }
        const expiresInMs = responseJson.expires_in * 1000

        const [newToken] = await db
            .update(integrationTokens)
            .set({
                accessToken: responseJson.access_token,
                expiresAt: new Date(Date.now() + expiresInMs),
            })
            .where(eq(integrationTokens.id, token.id))
            .returning()
        return newToken.accessToken
    }
    return token.accessToken
}

export async function getPinterestAccessToken(userId: string) {
    try {
        const token = await db.query.integrationTokens.findFirst({
            where: and(
                eq(integrationTokens.type, 'pinterestIntegration'),
                eq(integrationTokens.userId, userId)
            ),
        })
        if (!token) return null
        return await refreshPinterestAccessToken(token)
    } catch (e) {
        console.log(e)
        return null
    }
}
