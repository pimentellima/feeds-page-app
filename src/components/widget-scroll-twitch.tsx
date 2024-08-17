import { TwitchVideos } from '@/types/twitch'
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

export default function WidgetScrollTwitch({
    media,
}: {
    media: TwitchVideos[]
}) {
    return (
        <WidgetScroll>
            <WidgetScrollContent>
                {media.map((post) => (
                    <WidgetScrollItem href={post.url} key={post.id}>
                        <WidgetScrollItemImage mediaUrl={post.image_url} />
                        <WidgetScrollItemFooter>
                            <WidgetScrollItemCaption>
                                {post.title}
                            </WidgetScrollItemCaption>
                            <WidgetScrollItemTimestamp>
                                {!!post.create_time &&
                                    formatDistanceToNow(
                                        new Date(post.create_time),
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
