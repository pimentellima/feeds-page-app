import { db } from '@/drizzle/index'
import { integrationTokens } from '@/drizzle/schema'
import getUserInstagramData from '@/lib/get-user-instagram-data'
import getUserPinterestData from '@/lib/get-user-pinterest-data'
import getUserTiktokData from '@/lib/get-user-tiktok-data'
import getUserYoutubeData from '@/lib/get-user-youtube-data'
import { eq, InferSelectModel } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

export interface TimelineItem {
    id: string
    link?: string
    profile: {
        username: string
        link: string
    }
    caption?: string
    timestamp: Date
    type: 'instagram' | 'tiktok' | 'pinterest' | 'youtube'
}

export async function GET(
    req: NextRequest,
    { params }: { params: { userId: string } }
) {
    try {
        const tokens = await db.query.integrationTokens.findMany({
            where: eq(integrationTokens.userId, params.userId),
        })
        const timelineItems = await getTimelineItems(tokens)

        return NextResponse.json(timelineItems)
    } catch (e) {
        console.log(e)
        return NextResponse.json(e, { status: 500 })
    }
}

async function getTimelineItems(
    tokens: InferSelectModel<typeof integrationTokens>[]
) {
    let timelineItems: TimelineItem[] = []

    await Promise.all(
        tokens.map(async (t) => {
            if (t.type === 'instagramIntegration') {
                try {
                    const { media, profile } = await getUserInstagramData(
                        t.userId
                    )
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
                                    'https://instagram.com/' + profile.username,
                                username: profile.username,
                            },
                            timestamp: new Date(m.timestamp),
                        })
                    })
                } catch {}
            }
            if (t.type === 'tiktokIntegration') {
                try {
                    const { media, user } = await getUserTiktokData(t.userId)
                    media.map((m) => {
                        timelineItems.push({
                            type: 'tiktok',
                            id: m.id,
                            caption: 'posted a video on Tiktok',
                            link: m.share_url,
                            profile: {
                                link: 'https://tiktok.com/@' + user.username,
                                username: user.username,
                            },
                            timestamp: new Date(m.create_time * 1000),
                        })
                    })
                } catch (e) {
                    console.log(e)
                }
            }
            if (t.type === 'pinterestIntegration') {
                try {
                    const { media, profile } = await getUserPinterestData(
                        t.userId
                    )
                    media.map((m) => {
                        timelineItems.push({
                            type: 'pinterest',
                            id: m.id,
                            caption: 'pinned an image on Pinterest',
                            link: 'https://br.pinterest.com/pin/' + m.id,
                            profile: {
                                link:
                                    'https://pinterest.com/' + profile.username,
                                username: profile.username,
                            },
                            timestamp: new Date(m.timestamp),
                        })
                    })
                } catch (e) {
                    console.log(e)
                }
            }
            if (t.type === 'youtubeIntegration') {
                try {
                    const { media, channel } = await getUserYoutubeData(
                        t.userId
                    )

                    media.map((m) => {
                        timelineItems.push({
                            type: 'youtube',
                            id: m.id || crypto.randomUUID(),
                            caption: 'posted a video on Youtube',
                            link: `https://youtube.com/watch?v=${m.id}`,
                            profile: {
                                link: channel.url || '',
                                username: channel.title || '',
                            },
                            timestamp: new Date(m.timestamp),
                        })
                    })
                } catch (e) {
                    console.log(e)
                }
            }
        })
    )
    return timelineItems.sort(
        (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    )
}
