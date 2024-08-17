import { TWITCH_MEDIA_STALE_TIME_MS } from '@/constants'
import { getTwitchAccessToken } from '@/services/integration-tokens'
import { YoutubeChannel, YoutubeVideo } from '@/types/youtube'
import { fetchTwitchUser, fetchTwitchVideos } from './api-helpers/twitch'
import { client, connectRedis } from './redis-client'
import { TwitchVideos, TwitchUser } from '@/types/twitch'

export default async function (userId: string): Promise<{
    media: TwitchVideos[]
    user: TwitchUser
}> {
    await connectRedis()
    const cache = await client.get(`twitch-data:${userId}`)

    if (!cache) {
        const data = await getTwitchData(userId)
        const expiresAt = new Date(Date.now() + TWITCH_MEDIA_STALE_TIME_MS)
        await client.set(
            `twitch-data:${userId}`,
            JSON.stringify({ data, expiresAt })
        )
        return data
    }

    const cacheJson = JSON.parse(cache) as {
        data: { user: TwitchUser; media: TwitchVideos[] }
        expiresAt: Date
    }

    if (cacheJson.expiresAt < new Date()) {
        try {
            const data = await getTwitchData(userId)
            const expiresAt = new Date(Date.now() + TWITCH_MEDIA_STALE_TIME_MS)
            await client.set(
                `twitch-data:${userId}`,
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

async function getTwitchData(userId: string) {
    const accessToken = await getTwitchAccessToken(userId)
    const user = await fetchTwitchUser(accessToken)
    const media = (await fetchTwitchVideos(accessToken)) as TwitchVideos[]

    return { user, media }
}
