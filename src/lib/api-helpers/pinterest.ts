import { PinterestMedia, PinterestProfile } from '@/types/pinterest'

export interface PinterestProfileResponse {
    board_count: number
    following_count: number
    pin_count: number
    account_type: 'BUSINESS' | 'PERSONAL'
    monthly_views: number
    about: string
    id: string
    website_url: string
    profile_image: string
    business_name: string
    username: string
    follower_count: number
}

export interface PinterestPin {
    id: string
    created_at: string
    link: string
    title: string
    description: string
    media: {
        media_type: string
        images: {
            '150x150': {
                width: number
                height: number
                url: string
            }
            '400x300': {
                width: number
                height: number
                url: string
            }
            '600x': {
                width: number
                height: number
                url: string
            }
            '1200x': {
                width: number
                height: number
                url: string
            }
        }
    }
}

export async function fetchPinterestUserMedia(
    accessToken: string
): Promise<PinterestMedia[]> {
    const url =
        'https://api.pinterest.com/v5/pins?page_size=5&include_protected_pins=true'

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    })
    if (!response.ok)
        throw new Error(
            response.status === 401
                ? 'Invalid access token'
                : 'Error fetching Pinterest media',
            {
                cause: {
                    statusText: response.statusText,
                    status: response.status,
                },
            }
        )
    const data: { items: PinterestPin[] } = await response.json()
    return data.items.map((i) => ({
        id: i.id,
        title: i.title,
        timestamp: i.created_at,
        url: i.link,
        mediaUrl: i.media.images['600x'].url,
    }))
}

export async function fetchPinterestUserProfile(
    accessToken: string
): Promise<PinterestProfile> {
    const url = 'https://api.pinterest.com/v5/user_account'

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    })
    if (!response.ok)
        throw new Error(
            response.status === 401
                ? 'Invalid access token'
                : 'Error fetching Pinterest profile',
            {
                cause: {
                    statusText: response.statusText,
                    status: response.status,
                },
            }
        )
    const data: PinterestProfileResponse = await response.json()
    return { username: data.username }
}
