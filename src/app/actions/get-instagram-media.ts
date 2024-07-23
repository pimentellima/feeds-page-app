'use server'

import {
    fetchInstagramMedia,
    fetchInstagramProfile,
} from '@/lib/api-helpers/instagram'
import { getInstagramAccessToken } from '@/services/integration-tokens'

export async function getInstagramMedia(userId: string) {
    const accessToken = await getInstagramAccessToken(userId)

    if (!accessToken) return null

    const media = await fetchInstagramMedia(accessToken)
    const profile = await fetchInstagramProfile(accessToken)

    return {
        profile,
        media,
    }
}
