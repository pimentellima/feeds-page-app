export interface PinterestProfile {
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
    dominant_color: string
    alt_text: string
    creative_type: string
    board_id: string
    board_section_id: string
    board_owner: {
        username: string
    }
    is_owner: boolean
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
    parent_pin_id: string
    is_standard: boolean
    has_been_promoted: boolean
    note: string
    pin_metrics: {
        '90d': {
            pin_click: number
            impression: number
            clickthrough: number
        }
        lifetime_metrics: {
            pin_click: number
            impression: number
            clickthrough: number
            reaction: number
            comment: number
        }
    }
}

export async function fetchPinterestUserMedia(
    accessToken: string
): Promise<PinterestPin[]> {
    const url = 'https://api.pinterest.com/v5/pins'

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    })
    const data: { items: PinterestPin[] } = await response.json()
    return data.items
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

    const data: PinterestProfile = await response.json()
    console.log(data)
    return data
}
