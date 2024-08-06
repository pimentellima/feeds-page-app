import { db } from '@/drizzle/index'
import { integrationTokens } from '@/drizzle/schema'
import {
    fetchInstagramMedia,
    fetchInstagramProfile,
} from '@/lib/api-helpers/instagram'
import {
    fetchPinterestUserMedia,
    fetchPinterestUserProfile,
} from '@/lib/api-helpers/pinterest'
import { fetchTiktokMedia, fetchTiktokUser } from '@/lib/api-helpers/tiktok'
import {
    fetchYoutubeChannel,
    fetchYoutubeMedia,
} from '@/lib/api-helpers/youtube'
import {
    refreshInstagramAccessToken,
    refreshPinterestAccessToken,
    refreshTiktokAccessToken,
    refreshYoutubeAccessToken,
} from '@/services/integration-tokens'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

export interface TimelineItem {
    id: string
    link?: string
    profile: {
        username: string
        link: string
        pictureUrl?: string
    }
    caption?: string
    timestamp: Date
    type: 'instagram' | 'tiktok' | 'pinterest' | 'youtube'
}

export const revalidate = 1200

export async function GET(
    req: NextRequest,
    { params }: { params: { userId: string } }
) {
    try {
        const userId = params.userId
        const tokens = await db.query.integrationTokens.findMany({
            where: eq(integrationTokens.userId, userId),
        })

        let timelineItems: TimelineItem[] = []

        await Promise.all(
            tokens.map(async (t) => {
                if (t.type === 'instagramIntegration') {
                    const accessToken = await refreshInstagramAccessToken(t)
                    if (!accessToken) return
                    try {
                        const media = await fetchInstagramMedia(accessToken)
                        const profile = await fetchInstagramProfile(accessToken)
                        media.map((m) => {
                            let caption = ''
                            if (m.media_type === 'VIDEO')
                                caption = 'posted a video on Instagram'
                            if (
                                m.media_type === 'IMAGE' ||
                                m.media_type === 'CAROUSEL_ALBUM'
                            )
                                caption = 'posted a photo on Instagram'

                            timelineItems.push({
                                type: 'instagram',
                                id: m.id,
                                caption,
                                link: m.permalink,
                                profile: {
                                    link:
                                        'https://instagram.com/' +
                                        profile.username,
                                    username: profile.username,
                                },
                                timestamp: new Date(m.timestamp),
                            })
                        })
                    } catch (e) {
                        console.log(e)
                    }
                }
                if (t.type === 'tiktokIntegration') {
                    const accessToken = await refreshTiktokAccessToken(t)
                    if (!accessToken) return
                    try {
                        const media = await fetchTiktokMedia(accessToken)
                        const profile = await fetchTiktokUser(accessToken)
                        media.map((m) => {
                            timelineItems.push({
                                type: 'tiktok',
                                id: m.id,
                                caption: 'posted a video on Tiktok',
                                link: m.share_url,
                                profile: {
                                    link:
                                        'https://tiktok.com/@' +
                                        profile.username,
                                    username: profile.username,
                                    pictureUrl: profile.avatar_url,
                                },
                                timestamp: new Date(m.create_time * 1000),
                            })
                        })
                    } catch (e) {
                        console.log(e)
                    }
                }
                if (t.type === 'pinterestIntegration') {
                    const accessToken = await refreshPinterestAccessToken(t)
                    if (!accessToken) return
                    try {
                        const media = await fetchPinterestUserMedia(accessToken)
                        const user = await fetchPinterestUserProfile(
                            accessToken
                        )
                        media.map((m) => {
                            timelineItems.push({
                                type: 'pinterest',
                                id: m.id,
                                caption: 'pinned an image on Pinterest',
                                link: 'https://br.pinterest.com/pin/' + m.id,
                                profile: {
                                    link:
                                        'https://pinterest.com/' +
                                        user.username,
                                    username: user.username,
                                    pictureUrl: user.profile_image,
                                },
                                timestamp: new Date(m.created_at),
                            })
                        })
                    } catch (e) {
                        console.log(e)
                    }
                }
                if (t.type === 'youtubeIntegration') {
                    const accessToken = await refreshYoutubeAccessToken(t)
                    if (!accessToken) return
                    try {
                        const media = await fetchYoutubeMedia(accessToken)
                        const channel = await fetchYoutubeChannel(accessToken)
                        if (!channel || !media) return

                        media.map((m) => {
                            if (!m.snippet || !m.snippet.publishedAt || !m.id)
                                return
                            timelineItems.push({
                                type: 'youtube',
                                id: m.id || crypto.randomUUID(),
                                caption: 'posted a video on Youtube',
                                link: `https://youtube.com/watch?v=${m.id}`,
                                profile: {
                                    link: channel.customUrl || '',
                                    username: channel.title || '',
                                    pictureUrl:
                                        channel.thumbnails?.high?.url ||
                                        undefined,
                                },
                                timestamp: new Date(m.snippet.publishedAt),
                            })
                        })
                    } catch (e) {
                        console.log(e)
                    }
                }
            })
        )

        return NextResponse.json(
            timelineItems.sort(
                (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
            )
        )
    } catch (e) {
        console.log(e)
        return NextResponse.json(e, { status: 500 })
    }
}
