import { TiktokMedia, TiktokUser } from '@/types/tiktok'

interface TiktokMediaResponse {
    id: string
    title: string
    video_description: string
    duration: number
    cover_image_url: string
    embed_link: string
    create_time: number
    comment_count: number
    share_count: number
    view_count: number
    share_url: string
}

interface VideoData {
    videos: TiktokMediaResponse[]
    cursor: number
    has_more: boolean
}

interface Error {
    code: string
    message: string
    log_id: string
}

interface MediaApiResponse {
    data: VideoData
    error: Error
}

interface TiktokUserResponse {
    avatar_url: string
    open_id: string
    profile_deep_link: string
    username: string
    union_id: string
    display_name: string
}

interface UserData {
    user: TiktokUserResponse
}

interface UserApiResponse {
    data: UserData
    error: Error
}

export async function fetchTiktokUser(
    accessToken: string
): Promise<TiktokUser> {
    const profileUrl =
        'https://open.tiktokapis.com/v2/user/info/?fields=open_id,union_id,avatar_url,display_name,profile_deep_link,username'

    const response = await fetch(profileUrl, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
    if (!response.ok)
        throw new Error(
            response.status === 401
                ? 'Invalid access token'
                : 'Error fetching Tiktok user',
            {
                cause: {
                    statusText: response.statusText,
                    status: response.status,
                },
            }
        )
    const responseJson = (await response.json()) as UserApiResponse

    return {
        profile_deep_link: responseJson.data.user.profile_deep_link,
        username: responseJson.data.user.username,
    }
}

export async function fetchTiktokMedia(
    accessToken: string
): Promise<TiktokMedia[]> {
    const mediaUrl =
        'https://open.tiktokapis.com/v2/video/list/?fields=id,title,video_description,duration,cover_image_url,embed_link,create_time,share_url,comment_count,share_count,view_count'

    const response = await fetch(mediaUrl, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    })
    if (!response.ok)
        throw new Error(
            response.status === 401
                ? 'Invalid access token'
                : 'Error fetching Tiktok media',
            {
                cause: {
                    statusText: response.statusText,
                    status: response.status,
                },
            }
        )
    const responseJson = (await response.json()) as MediaApiResponse
    return responseJson.data.videos.map((i) => ({
        cover_image_url: i.cover_image_url,
        create_time: i.create_time,
        id: i.id,
        share_url: i.share_url,
        title: i.title,
    }))
}
