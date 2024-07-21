'use server'

import { db } from '@/drizzle/index'
import { integrationTokens, widgets } from '@/drizzle/schema'
import { getTiktokProfileAndMedia } from '@/lib/api-helpers/tiktok'
import { refreshIntegrationAccessTokens } from '@/services/integration-tokens'
import { and, eq } from 'drizzle-orm'

export async function getTiktokMedia(userId: string) {
    const token = await db.query.integrationTokens.findFirst({
        where: and(
            eq(integrationTokens.userId, userId),
            eq(integrationTokens.type, 'tiktokIntegration')
        ),
    })
    if (!token) return null

    const accessToken =
        token.expiresAt && new Date() > token.expiresAt
            ? await refreshIntegrationAccessTokens(token, 'tiktokIntegration')
            : token.accessToken

    if (!accessToken) return null

    const { mediaData, profileData } = await getTiktokProfileAndMedia(
        token.accessToken
    )

    return {
        videos: mediaData.videos,
        user: profileData.user,
    }
}
