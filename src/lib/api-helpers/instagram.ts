import { InstagramMedia, InstagramProfile } from '@/types/instagram'

interface InstagramMediaResponse {
    id: string
    caption?: string
    media_url: string
    media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
    thumbnail_url?: string
    timestamp: string
    permalink?: string
}

export async function fetchInstagramProfile(
    accessToken: string
): Promise<InstagramProfile> {
    const response = await fetch(
        `https://graph.instagram.com/me?fields=username,media_count,account_type&access_token=${accessToken}`
    )
    if (!response.ok)
        throw new Error(
            response.status === 401
                ? 'Invalid access token'
                : 'Error fetching Instagram profile',
            {
                cause: {
                    statusText: response.statusText,
                    status: response.status,
                },
            }
        )

    const responseJson = (await response.json()) as InstagramProfileResponse

    return { username: responseJson.username }
}

export async function fetchInstagramMedia(
    accessToken: string
): Promise<InstagramMedia[]> {
    const response = await fetch(
        `https://graph.instagram.com/me/media?fields=caption,media_url,media_type,thumbnail_url,timestamp,permalink&access_token=${accessToken}`
    )
    if (!response.ok)
        throw new Error(
            response.status === 401
                ? 'Invalid access token'
                : 'Error fetching Instagram media',
            {
                cause: {
                    statusText: response.statusText,
                    status: response.status,
                },
            }
        )

    const responseJson = (await response.json())
        .data as InstagramMediaResponse[]
    return responseJson.map((i) => ({
        id: i.id,
        caption: i.caption,
        media_url: i.media_url,
        timestamp: i.timestamp,
        media_type: i.media_type,
    }))
}

interface InstagramProfileResponse {
    username: string
    media_count: number
    account_type: 'BUSINESS' | 'MEDIA_CREATOR' | 'PERSONAL'
}
