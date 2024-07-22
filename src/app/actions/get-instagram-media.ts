'use server'

import { db } from '@/drizzle/index'
import { integrationTokens } from '@/drizzle/schema'
import {
    fetchInstagramMedia,
    fetchInstagramProfile,
} from '@/lib/api-helpers/instagram'
import { getUserIntegrationAccessToken } from '@/services/integration-tokens'
import { and, eq } from 'drizzle-orm'

export async function getInstagramMedia(userId: string) {
    try {
        const token = await db.query.integrationTokens.findFirst({
            where: and(
                eq(integrationTokens.userId, userId),
                eq(integrationTokens.type, 'instagramIntegration')
            ),
        })
        if (!token) return null

        const accessToken = getUserIntegrationAccessToken(
            'instagramIntegration'
        )

        if (!accessToken) return null

        const media = await fetchInstagramMedia(token.accessToken)
        const profile = await fetchInstagramProfile(token.accessToken)

        return {
            profile,
            media,
        }
    } catch (e) {
        throw e
    }
}
