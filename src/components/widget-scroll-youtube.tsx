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
    media: { mediaUrl: string; id: string; title: string; timestamp: string }[]
}) {
    if (media.length === 0) return <p>No recent updates</p>

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
                            <WidgetScrollItemImage mediaUrl={video.mediaUrl} />
                            <WidgetScrollItemFooter>
                                <WidgetScrollItemCaption>
                                    {video.title}
                                </WidgetScrollItemCaption>
                                <WidgetScrollItemTimestamp>
                                    {formatDistanceToNow(
                                        new Date(video.timestamp),
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
