import { google } from 'googleapis'
import { oauth2Client } from '../google-oauth-client'

interface VideoSnippet {
    publishedAt: string
    channelId: string
    title: string
    description: string
    thumbnails: {
        default: Thumbnail
        medium: Thumbnail
        high: Thumbnail
    }
    channelTitle: string
    tags?: string[]
    categoryId: string
    liveBroadcastContent: string
    localized: {
        title: string
        description: string
    }
}

interface Thumbnail {
    url: string
    width: number
    height: number
}

interface YouTubeVideosResponse {
    kind: string
    etag: string
    items: YouTubeVideo[]
    pageInfo: {
        totalResults: number
        resultsPerPage: number
    }
}

export interface YouTubeVideo {
    kind: string
    etag: string
    id: string
    snippet: VideoSnippet
}

// Type representing the content details of a channel
interface ChannelContentDetails {
    relatedPlaylists: {
        uploads: string // ID of the playlist that contains the channel's uploaded videos
        watchLater?: string // ID of the playlist for "Watch Later" (optional)
        favorites?: string // ID of the playlist for "Favorites" (optional)
        likes?: string // ID of the playlist for "Likes" (optional)
    }
}

// Type representing the response from the YouTube API for channel details
interface YouTubeChannelResponse {
    kind: string // Type of the API response
    etag: string // ETag of the response
    items: YouTubeChannel[] // Array of channel items
}

// Type representing a channel item
interface YouTubeChannel {
    kind: string // Type of the channel item
    etag: string // ETag of the channel item
    id: string // Channel ID
    contentDetails: ChannelContentDetails // Content details of the channel
}

interface ChannelSectionsResponse {
    kind: string
    etag: string
    pageInfo: {
        totalResults: number
        resultsPerPage: number
    }
    items: ChannelSection[]
}

interface ChannelSection {
    kind: string
    etag: string
    id: string
    contentDetails: {
        channels: string[]
        playlists: string[]
    }
}

export async function fetchYoutubeChannel(accessToken: string) {
    oauth2Client.setCredentials({
        access_token: accessToken,
    })
    const youtube = google.youtube({
        auth: oauth2Client,
        version: 'v3',
    })
    const channelResponse = await youtube.channels.list({
        part: ['snippet'],
        mine: true,
    })

    return channelResponse.data.items?.[0].snippet || null
}
export async function fetchYoutubeMedia(accessToken: string) {
    oauth2Client.setCredentials({
        access_token: accessToken,
    })
    const youtube = google.youtube({
        auth: oauth2Client,
        version: 'v3',
    })
    const channelResponse = await youtube.channels.list({
        mine: true,
        part: ['id'],
        access_token: accessToken,
    })

    const channelId = channelResponse.data.items?.[0].id
    if (!channelId) return null

    const videosResponse = await youtube.search.list({
        part: ['id'],
        channelId: channelId,
        maxResults: 5,
        order: 'date',
    })
    const videoIds =
        videosResponse.data?.items?.map((item) => item.id?.videoId) || []

    const detailedResponse = await youtube.videos.list({
        part: ['snippet,contentDetails'],
        id: videoIds.filter((i) => typeof i === 'string'),
    })
    return detailedResponse.data.items
}
