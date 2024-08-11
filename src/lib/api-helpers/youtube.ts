import { google } from 'googleapis'
import { oauth2Client } from '../google-oauth-client'
import { YoutubeChannel, YoutubeVideo } from '@/types/youtube'

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

interface YouTubeVideo {
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
    items: YouTubeChannelResponse[] // Array of channel items
}

// Type representing a channel item
interface YouTubeChannelResponse {
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

export async function fetchYoutubeChannel(
    accessToken: string
): Promise<YoutubeChannel> {
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
    if (channelResponse.status !== 200 || !channelResponse.data.items)
        throw new Error(
            channelResponse.status === 401
                ? 'Invalid access token'
                : 'Error fetching Youtube channel data',
            {
                cause: {
                    statusText: channelResponse.statusText,
                    status: channelResponse.status,
                },
            }
        )

    const { snippet } = channelResponse.data.items[0]
    if (!snippet) throw new Error('No available data')
    const { customUrl, title } = snippet
    if (!title || !customUrl) throw new Error('No available data')

    return {
        title,
        url: customUrl,
    }
}
export async function fetchYoutubeMedia(
    accessToken: string
): Promise<YoutubeVideo[]> {
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
    if (channelResponse.status !== 200 || !channelResponse.data.items)
        throw new Error(
            channelResponse.status === 401
                ? 'Invalid access token'
                : 'Error fetching Youtube channel data',
            {
                cause: {
                    statusText: channelResponse.statusText,
                    status: channelResponse.status,
                },
            }
        )

    const channelId = channelResponse.data.items[0].id
    if (!channelId) throw new Error('No channel ID found')

    const videosResponse = await youtube.search.list({
        part: ['id'],
        channelId: channelId,
        maxResults: 5,
        order: 'date',
    })
    if (videosResponse.status !== 200 || !videosResponse.data.items)
        throw new Error('Error fetching Youtube media', {
            cause: {
                statusText: channelResponse.statusText,
                status: channelResponse.status,
            },
        })
    const videoIds = videosResponse.data.items.map((item) => item.id?.videoId)

    const detailedResponse = await youtube.videos.list({
        part: ['snippet,contentDetails'],
        id: videoIds.filter((i) => typeof i === 'string'),
    })
    if (detailedResponse.status !== 200 || !detailedResponse.data.items)
        throw new Error('Error fetching Youtube media details', {
            cause: {
                statusText: channelResponse.statusText,
                status: channelResponse.status,
            },
        })
    let result: YoutubeVideo[] = []
    detailedResponse.data.items.map((i) => {
        const { id, snippet } = i
        if (!id) return
        if (!snippet) return
        const { title, thumbnails, publishedAt } = snippet
        if (!title || !thumbnails || !publishedAt) return
        result.push({
            id,
            title,
            mediaUrl:
                thumbnails.high?.url ||
                thumbnails.medium?.url ||
                thumbnails.default?.url ||
                '',
            timestamp: publishedAt,
        })
    })
    return result
}
