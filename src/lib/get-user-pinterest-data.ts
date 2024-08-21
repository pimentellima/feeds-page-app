import { PINTEREST_MEDIA_STALE_TIME_MS } from '@/constants'
import {
    fetchPinterestUserMedia,
    fetchPinterestUserProfile,
} from '@/lib/api-helpers/pinterest'
import { client, connectRedis } from '@/lib/redis-client'
import { getPinterestAccessToken } from '@/services/integration-tokens'
import { PinterestMedia, PinterestProfile } from '@/types/pinterest'

export default async function (userId: string): Promise<{
    media: PinterestMedia[]
    profile: PinterestProfile
}> {
    await connectRedis()
    const cache = await client.get(`pinterest-data:${userId}`)
    if (!cache) {
        const data = await getPinterestData(userId)
        const expiresAt = new Date(Date.now() + PINTEREST_MEDIA_STALE_TIME_MS)
        await client.set(
            `pinterest-data:${userId}`,
            JSON.stringify({ data, expiresAt })
        )
        return data
    }

    const cacheJson = JSON.parse(cache) as {
        data: any
        expiresAt: string
    }

    if (new Date(cacheJson.expiresAt) < new Date()) {
        try {
            const data = await getPinterestData(userId)
            const expiresAt = new Date(
                Date.now() + PINTEREST_MEDIA_STALE_TIME_MS
            )
            await client.set(
                `pinterest-data:${userId}`,
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

async function getPinterestData(userId: string): Promise<{
    media: PinterestMedia[]
    profile: PinterestProfile
}> {
    const accessToken = await getPinterestAccessToken(userId)
    const media = await fetchPinterestUserMedia(accessToken)
    const profile = await fetchPinterestUserProfile(accessToken)
    if (!media) {
        throw new Error('Error fetching media from Pinterest API')
    }
    if (!profile) {
        throw new Error('Error fetching channel from Pinterest API')
    }

    return { media, profile }
}
