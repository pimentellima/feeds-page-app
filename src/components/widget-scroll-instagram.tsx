import { formatDistanceToNow } from 'date-fns'
import {
    WidgetScroll,
    WidgetScrollContent,
    WidgetScrollItem,
    WidgetScrollItemCaption,
    WidgetScrollItemFooter,
    WidgetScrollItemImage,
    WidgetScrollItemTimestamp,
} from './widget-scroll'
import { InstagramMedia } from '@/types/instagram'

export default function WidgetScrollInstagram({
    media,
}: {
    media: InstagramMedia[]
}) {
    if (media.length === 0) return <p>No recent updates</p>

    return (
        <WidgetScroll>
            <WidgetScrollContent>
                {media.map((post) => (
                    <WidgetScrollItem key={post.id} href={post.permalink}>
                        <WidgetScrollItemImage mediaUrl={post.media_url} />
                        <WidgetScrollItemFooter>
                            <WidgetScrollItemCaption>
                                {post.caption}
                            </WidgetScrollItemCaption>
                            <WidgetScrollItemTimestamp>
                                {!!post.timestamp &&
                                    formatDistanceToNow(
                                        new Date(post.timestamp),
                                        {
                                            addSuffix: true,
                                        }
                                    )}
                            </WidgetScrollItemTimestamp>
                        </WidgetScrollItemFooter>
                    </WidgetScrollItem>
                ))}
            </WidgetScrollContent>
        </WidgetScroll>
    )
}
