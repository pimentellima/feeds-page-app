import { TwitchUser, TwitchVideos } from '@/types/twitch'

interface TwitchUserResponse {
    id: string
    login: string
    display_name: string
    type: string
    broadcaster_type: string
    description: string
    profile_image_url: string
    offline_image_url: string
    view_count: number
    email: string
    created_at: string
}

interface TwitchVideoResponse {
    id: string
    stream_id: string
    user_id: string
    user_login: string
    user_name: string
    title: string
    description: string
    created_at: string
    published_at: string
    url: string
    thumbnail_url: string
    viewable: string
    view_count: number
    language: string
    type: string
    duration: string
    muted_segments: any
}

export async function fetchTwitchUser(
    accessToken: string
): Promise<TwitchUser> {
    const response = await fetch('https://api.twitch.tv/helix/users', {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Client-Id': process.env.TWITCH_CLIENT_ID!,
        },
    })
    if (!response.ok)
        throw new Error(
            response.status === 401
                ? 'Invalid access token'
                : 'Error fetching Twitch user',
            {
                cause: {
                    statusText: response.statusText,
                    status: response.status,
                },
            }
        )
    const data = (await response.json()) as { data: TwitchUserResponse[] }
    const user = data.data?.[0]
    if (!user)
        throw new Error('No user found', {
            cause: {
                status: 500,
            },
        })
    return {
        username: user.display_name,
    }
}

export async function fetchTwitchVideos(
    accessToken: string
): Promise<TwitchVideos[]> {
    const response = await fetch('https://api.twitch.tv/helix/videos', {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Client-Id': process.env.TWITCH_CLIENT_ID!,
        },
    })
    if (!response.ok)
        throw new Error(
            response.status === 401
                ? 'Invalid access token'
                : 'Error fetching Twitch videos',
            {
                cause: {
                    statusText: response.statusText,
                    status: response.status,
                },
            }
        )
    const data = (await response.json()) as { data: TwitchVideoResponse[] }
    return data.data.map((video) => ({
        id: video.id,
        title: video.title,
        url: video.url,
        create_time: video.created_at,
        image_url: video.thumbnail_url,
    }))
}
