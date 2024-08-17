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
import { TiktokMedia } from '@/types/tiktok'

export default function WidgetScrollTiktok({
    media,
}: {
    media: TiktokMedia[]
}) {
    if (media.length === 0) return <p>No recent updates</p>

    return (
        <WidgetScroll>
            <WidgetScrollContent>
                {media.map((post) => (
                    <WidgetScrollItem key={post.id} href={post.share_url}>
                        <WidgetScrollItemImage
                            mediaUrl={post.cover_image_url}
                        />
                        <WidgetScrollItemFooter>
                            <WidgetScrollItemCaption>
                                {post.title}
                            </WidgetScrollItemCaption>
                            <WidgetScrollItemTimestamp>
                                {!!post.create_time &&
                                    formatDistanceToNow(
                                        new Date(post.create_time * 1000),
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
