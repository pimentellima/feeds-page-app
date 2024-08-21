import { SPOTIFY_MEDIA_STALE_TIME_MS } from '@/constants'
import {
    fetchSpotifyMedia,
    fetchSpotifyProfile,
} from '@/lib/api-helpers/spotify'
import { client, connectRedis } from '@/lib/redis-client'
import { getSpotifyAccessToken } from '@/services/integration-tokens'
import { SpotifyPlayedTrack, SpotifyProfile } from '@/types/spotify'

export default async function (userId: string) {
    await connectRedis()
    const cache = await client.get(`spotify-data:${userId}`)
    if (!cache) {
        const data = await getSpotifyData(userId)
        const expiresAt = new Date(Date.now() + SPOTIFY_MEDIA_STALE_TIME_MS)
        await client.set(
            `spotify-data:${userId}`,
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
            const data = await getSpotifyData(userId)
            const expiresAt = new Date(Date.now() + SPOTIFY_MEDIA_STALE_TIME_MS)
            await client.set(
                `spotify-data:${userId}`,
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

async function getSpotifyData(
    userId: string
): Promise<{ media: SpotifyPlayedTrack[]; profile: SpotifyProfile }> {
    const accessToken = await getSpotifyAccessToken(userId)
    const media = await fetchSpotifyMedia(accessToken)
    const profile = await fetchSpotifyProfile(accessToken)

    return { media, profile }
}
