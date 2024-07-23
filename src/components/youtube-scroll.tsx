import { InstagramPost } from '@/lib/api-helpers/instagram'
import { formatDistanceToNow } from 'date-fns'
import {
    Scroll,
    ScrollContent,
    ScrollItem,
    ScrollItemCaption,
    ScrollItemFooter,
    ScrollItemImage,
    ScrollItemTimestamp,
} from './scroll'
import { YouTubeVideo } from '@/lib/api-helpers/youtube'
import { youtube_v3 } from 'googleapis'

export default function YoutubeScroll({
    media,
}: {
    media: youtube_v3.Schema$Video[]
}) {
    return (
        <Scroll>
            <ScrollContent>
                {media
                    .filter((i) => !!i)
                    .map((video) => (
                        <ScrollItem
                            href={'https://www.youtube.com/watch?v=' + video.id}
                            key={video.id}
                        >
                            <ScrollItemImage
                                mediaUrl={
                                    video.snippet?.thumbnails?.high
                                        ?.url ||
                                    video.snippet?.thumbnails?.medium
                                        ?.url ||
                                    ''
                                }
                            />
                            <ScrollItemFooter>
                                <ScrollItemCaption>
                                    {video.snippet?.title}
                                </ScrollItemCaption>
                                <ScrollItemTimestamp>
                                    {video.snippet?.publishedAt &&
                                        formatDistanceToNow(
                                            new Date(
                                                video.snippet.publishedAt
                                            ),
                                            { addSuffix: true }
                                        )}
                                </ScrollItemTimestamp>
                            </ScrollItemFooter>
                        </ScrollItem>
                    ))}
            </ScrollContent>
        </Scroll>
    )
}
