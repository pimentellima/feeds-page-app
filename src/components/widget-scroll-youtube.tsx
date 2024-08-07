import { formatDistanceToNow } from 'date-fns'
import { youtube_v3 } from 'googleapis'
import {
    WidgetScroll,
    WidgetScrollContent,
    WidgetScrollItem,
    WidgetScrollItemCaption,
    WidgetScrollItemFooter,
    WidgetScrollItemImage,
    WidgetScrollItemTimestamp,
} from './widget-scroll'

export default function WidgetScrollYoutube({
    media,
}: {
    media: youtube_v3.Schema$Video[]
}) {
    return (
        <WidgetScroll>
            <WidgetScrollContent>
                {media
                    .filter((i) => !!i)
                    .map((video) => (
                        <WidgetScrollItem
                            href={'https://www.youtube.com/watch?v=' + video.id}
                            key={video.id}
                        >
                            <WidgetScrollItemImage
                                mediaUrl={
                                    video.snippet?.thumbnails?.high?.url ||
                                    video.snippet?.thumbnails?.medium?.url ||
                                    ''
                                }
                            />
                            <WidgetScrollItemFooter>
                                <WidgetScrollItemCaption>
                                    {video.snippet?.title}
                                </WidgetScrollItemCaption>
                                <WidgetScrollItemTimestamp>
                                    {video.snippet?.publishedAt &&
                                        formatDistanceToNow(
                                            new Date(video.snippet.publishedAt),
                                            { addSuffix: true }
                                        )}
                                </WidgetScrollItemTimestamp>
                            </WidgetScrollItemFooter>
                        </WidgetScrollItem>
                    ))}
            </WidgetScrollContent>
        </WidgetScroll>
    )
}
