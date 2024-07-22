/* id,title,video_description,duration,cover_image_url,embed_link,create_time,share_url,comment_count,share_count,view_count */

export interface TiktokMedia {
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

export interface VideoData {
    videos: TiktokMedia[]
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

export interface TiktokUser {
    avatar_url: string
    open_id: string
    profile_deep_link: string
    username: string
    union_id: string
    display_name: string
}

export interface UserData {
    user: TiktokUser
}

interface UserApiResponse {
    data: UserData
    error: Error
}

export async function fetchTiktokUser(accessToken: string) {
    const profileUrl =
        'https://open.tiktokapis.com/v2/user/info/?fields=open_id,union_id,avatar_url,display_name,profile_deep_link,username'

    const response = await fetch(profileUrl, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
    const responseJson = (await response.json()) as UserApiResponse

    return responseJson.data.user
}

export async function fetchTiktokMedia(accessToken: string) {
    const mediaUrl =
        'https://open.tiktokapis.com/v2/video/list/?fields=id,title,video_description,duration,cover_image_url,embed_link,create_time,share_url,comment_count,share_count,view_count'

    const response = await fetch(mediaUrl, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    })
    const responseJson = (await response.json()) as MediaApiResponse
    return responseJson.data.videos
}
