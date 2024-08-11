import { getYoutubeAccessToken } from '@/services/integration-tokens'
import { client, connectRedis } from './redis-client'
import { fetchYoutubeChannel, fetchYoutubeMedia } from './api-helpers/youtube'
import { YOUTUBE_MEDIA_STALE_TIME_MS } from '@/constants'
import { YoutubeChannel, YoutubeVideo } from '@/types/youtube'

export default async function (userId: string): Promise<{
    channel: YoutubeChannel
    media: YoutubeVideo[]
}> {
    await connectRedis()
    const cache = await client.get(`youtube-data:${userId}`)

    if (!cache) {
        const data = await getYoutubeData(userId)
        const expiresAt = new Date(Date.now() + YOUTUBE_MEDIA_STALE_TIME_MS)
        await client.set(
            `youtube-data:${userId}`,
            JSON.stringify({ data, expiresAt })
        )
        return data
    }

    const cacheJson = JSON.parse(cache) as {
        data: { channel: YoutubeChannel; media: YoutubeVideo[] }
        expiresAt: Date
    }

    if (cacheJson.expiresAt < new Date()) {
        try {
            const data = await getYoutubeData(userId)
            const expiresAt = new Date(Date.now() + YOUTUBE_MEDIA_STALE_TIME_MS)
            await client.set(
                `youtube-data:${userId}`,
                JSON.stringify({ data, expiresAt })
            )
            return data
        } catch (e) {
            console.log(e)
            return cacheJson.data
        }
    }
    return cacheJson.data
}

async function getYoutubeData(userId: string) {
    const accessToken = await getYoutubeAccessToken(userId)
    const media = await fetchYoutubeMedia(accessToken)
    const channel = await fetchYoutubeChannel(accessToken)

    return { media, channel }
}
