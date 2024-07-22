'use server'

import { db } from '@/drizzle/index'
import { integrationTokens } from '@/drizzle/schema'
import { fetchTiktokMedia, fetchTiktokUser } from '@/lib/api-helpers/tiktok'
import { getUserIntegrationAccessToken } from '@/services/integration-tokens'
import { and, eq } from 'drizzle-orm'

export async function getTiktokMedia(userId: string) {
    const token = await db.query.integrationTokens.findFirst({
        where: and(
            eq(integrationTokens.userId, userId),
            eq(integrationTokens.type, 'tiktokIntegration')
        ),
    })
    if (!token) return null

    const accessToken = await getUserIntegrationAccessToken('tiktokIntegration')

    if (!accessToken) return null

    const videos = await fetchTiktokMedia(accessToken)
    const user = await fetchTiktokUser(accessToken)

    return {
        videos,
        user,
    }
}
