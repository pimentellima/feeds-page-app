export interface InstagramPost {
    id: string
    caption?: string
    media_url: string
    media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
    thumbnail_url?: string
    timestamp: string
    permalink?: string
}

export async function fetchInstagramProfile(accessToken: string) {
    const response = await fetch(
        `https://graph.instagram.com/me?fields=username,media_count,account_type&access_token=${accessToken}`
    )
    const responseJson = (await response.json()) as InstagramProfile

    return responseJson
}

export async function fetchInstagramMedia(accessToken: string) {
    const response = await fetch(
        `https://graph.instagram.com/me/media?fields=caption,media_url,media_type,thumbnail_url,timestamp,permalink&access_token=${accessToken}`
    )
    const responseJson = (await response.json()).data as InstagramPost[]
    return responseJson
}

export interface InstagramProfile {
    username: string
    media_count: number
    account_type: 'BUSINESS' | 'MEDIA_CREATOR' | 'PERSONAL'
}
