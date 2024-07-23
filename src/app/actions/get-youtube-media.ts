'use server'

import {
    fetchYoutubeMedia,
    fetchYoutubeChannel,
} from '@/lib/api-helpers/youtube'
import { getYoutubeAccessToken } from '@/services/integration-tokens'

export async function getYoutubeMedia(userId: string) {
    const accessToken = await getYoutubeAccessToken(userId)

    if (!accessToken) return null

    const media = await fetchYoutubeMedia(accessToken) || null
    const channel = await fetchYoutubeChannel(accessToken)

    return {
        channel,
        media,
    }
}
