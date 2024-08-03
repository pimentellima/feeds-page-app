'use server'

import {
    fetchPinterestUserMedia,
    fetchPinterestUserProfile,
} from '@/lib/api-helpers/pinterest'
import { getPinterestAccessToken } from '@/services/integration-tokens'

export async function getPinterestMedia(userId: string) {
    const accessToken = await getPinterestAccessToken(userId)

    if (!accessToken) return null

    const media = await fetchPinterestUserMedia(accessToken)
    const user = await fetchPinterestUserProfile(accessToken)

    return {
        media,
        user,
    }
}
