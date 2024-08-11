import { TIKTOK_MEDIA_STALE_TIME_MS } from '@/constants'
import { fetchTiktokMedia, fetchTiktokUser } from '@/lib/api-helpers/tiktok'
import { client, connectRedis } from '@/lib/redis-client'
import { getTiktokAccessToken } from '@/services/integration-tokens'
import { TiktokMedia, TiktokUser } from '@/types/tiktok'

export default async function (
    userId: string
): Promise<{ media: TiktokMedia[]; user: TiktokUser }> {
    await connectRedis()
    const cache = await client.get(`tiktok-data:${userId}`)
    if (!cache) {
        const data = await fetchTikokData(userId)
        const expiresAt = new Date(Date.now() + TIKTOK_MEDIA_STALE_TIME_MS)
        await client.set(
            `tiktok-data:${userId}`,
            JSON.stringify({ data, expiresAt })
        )
        return data
    }

    const cacheJson = JSON.parse(cache) as {
        data: { media: TiktokMedia[]; user: TiktokUser }
        expiresAt: Date
    }

    if (cacheJson.expiresAt < new Date()) {
        try {
            const data = await fetchTikokData(userId)
            const expiresAt = new Date(Date.now() + TIKTOK_MEDIA_STALE_TIME_MS)
            await client.set(
                `tiktok-data:${userId}`,
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

async function fetchTikokData(
    userId: string
): Promise<{ media: TiktokMedia[]; user: TiktokUser }> {
    const accessToken = await getTiktokAccessToken(userId)
    const media = await fetchTiktokMedia(accessToken)
    const user = await fetchTiktokUser(accessToken)

    return { media, user }
}
