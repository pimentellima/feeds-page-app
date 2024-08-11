export type InstagramMedia = {
    id: string
    permalink?: string
    media_url: string
    caption?: string
    timestamp: string
    media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM"
}

export type InstagramProfile = {
    username: string
}