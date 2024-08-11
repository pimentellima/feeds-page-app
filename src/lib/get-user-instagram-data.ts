import { INSTAGRAM_MEDIA_STALE_TIME_MS } from '@/constants'
import {
    fetchInstagramMedia,
    fetchInstagramProfile,
} from '@/lib/api-helpers/instagram'
import { client, connectRedis } from '@/lib/redis-client'
import { getInstagramAccessToken } from '@/services/integration-tokens'
import { InstagramMedia, InstagramProfile } from '@/types/instagram'

export default async function (userId: string): Promise<{
    profile: InstagramProfile
    media: InstagramMedia[]
}> {
    await connectRedis()
    const cache = await client.get(`instagram-data:${userId}`)
    if (!cache) {
        const data = await getInstagramData(userId)
        const expiresAt = new Date(Date.now() + INSTAGRAM_MEDIA_STALE_TIME_MS)
        await client.set(
            `instagram-data:${userId}`,
            JSON.stringify({ data, expiresAt })
        )
        return data
    }

    const cacheJson = JSON.parse(cache) as {
        data: any
        expiresAt: Date
    }

    if (cacheJson.expiresAt < new Date()) {
        try {
            const data = await getInstagramData(userId)
            const expiresAt = new Date(
                Date.now() + INSTAGRAM_MEDIA_STALE_TIME_MS
            )
            await client.set(
                `instagram-data:${userId}`,
                JSON.stringify({ data, expiresAt })
            )
            return data
        } catch (e) {
            return cacheJson.data
        }
    }
    return cacheJson.data
}

async function getInstagramData(userId: string) {
    const accessToken = await getInstagramAccessToken(userId)
    const media = await fetchInstagramMedia(accessToken)
    const profile = await fetchInstagramProfile(accessToken)

    return { media, profile }
}
