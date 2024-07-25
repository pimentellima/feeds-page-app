'use server'

import { fetchSpotifyMedia, fetchSpotifyProfile } from '@/lib/api-helpers/spotify'
import {
    getSpotifyAccessToken
} from '@/services/integration-tokens'

export async function getSpotifyMedia(userId: string) {
    const accessToken = await getSpotifyAccessToken(userId)

    if (!accessToken) return null

    const media = await fetchSpotifyMedia(accessToken)
    const profile = await fetchSpotifyProfile(accessToken)

    return {
        profile,
        media,
    }
}
