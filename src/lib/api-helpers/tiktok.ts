/* id,title,video_description,duration,cover_image_url,embed_link,create_time,share_url,comment_count,share_count,view_count */

export interface TiktokVideo {
    id: string
    title: string
    video_description: string
    duration: number
    cover_image_url: string
    embed_link: string
    create_time: number,
    comment_count: number,
    share_count: number,
    view_count: number,
    share_url: string
}

interface VideoData {
    videos: TiktokVideo[]
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

interface UserData {
    user: TiktokUser
}

interface UserApiResponse {
    data: UserData
    error: Error
}

export async function getTiktokProfileAndMedia(accessToken: string) {
    try {
        const profileUrl =
            'https://open.tiktokapis.com/v2/user/info/?fields=open_id,union_id,avatar_url,display_name,profile_deep_link,username'
        const mediaUrl =
            'https://open.tiktokapis.com/v2/video/list/?fields=id,title,video_description,duration,cover_image_url,embed_link,create_time,share_url,comment_count,share_count,view_count'

        const userResponse = await fetch(profileUrl, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
        const userResponseJson = (await userResponse.json()) as UserApiResponse

        const mediaResponse = await fetch(mediaUrl, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        })
        const mediaResponseJson =
            (await mediaResponse.json()) as MediaApiResponse
        const videoIds = mediaResponseJson.data.videos.map((video) => video.id)

        return {
            profileData: userResponseJson.data,
            mediaData: mediaResponseJson.data,
        }
    } catch (e) {
        return null
    }
}
