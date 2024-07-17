export interface InstagramPost {
    id: string
    caption?: string
    media_url: string
    media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
    thumbnail_url?: string
    timestamp: string
    permalink?: string
}

export async function getInstagramProfileAndMedia(accessToken: string) {
    const mediaResponse = await fetch(
        `https://graph.instagram.com/me/media?fields=caption,media_url,media_type,thumbnail_url,timestamp,permalink&access_token=${accessToken}`
    )
    const mediaResponseJson = (await mediaResponse.json())
        .data as InstagramPost[]
    const profileResponse = await fetch(
        `https://graph.instagram.com/me?fields=username,media_count,account_type&access_token=${accessToken}`
    )
    const profileResponseJson =
        (await profileResponse.json()) as InstagramProfile

    return {
        profile: profileResponseJson,
        media: mediaResponseJson,
    }
}

export interface InstagramProfile {
    username: string
    media_count: number
    account_type: 'BUSINESS' | 'MEDIA_CREATOR' | 'PERSONAL'
}
