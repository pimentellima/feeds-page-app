'use server'

import { db } from '@/drizzle/index'
import { integrationTokens, widgets } from '@/drizzle/schema'
import { getInstagramProfileAndMedia } from '@/lib/api-helpers/instagram'
import { refreshIntegrationAccessTokens } from '@/services/integration-tokens'
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

        const accessToken =
            token.expiresAt && new Date() > token.expiresAt
                ? await refreshIntegrationAccessTokens(
                      token,
                      'instagramIntegration'
                  )
                : token.accessToken

        if (!accessToken) return null

        const { media, profile } = await getInstagramProfileAndMedia(
            token.accessToken
        )
        return {
            profile,
            media,
        }
    } catch (e) {
        console.log(e)
        throw e
    }
}
