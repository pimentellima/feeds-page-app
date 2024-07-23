'use server'

import { fetchTiktokMedia, fetchTiktokUser } from '@/lib/api-helpers/tiktok'
import { getTiktokAccessToken } from '@/services/integration-tokens'

export async function getTiktokMedia(userId: string) {
    const accessToken = await getTiktokAccessToken(userId)

    if (!accessToken) return null

    const videos = await fetchTiktokMedia(accessToken)
    const user = await fetchTiktokUser(accessToken)

    return {
        videos,
        user,
    }
}
