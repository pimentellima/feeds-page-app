import { InstagramPost } from '@/lib/api-helpers/instagram'
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

export default function WidgetScrollInstagram({ media }: { media: InstagramPost[] }) {
    return (
        <WidgetScroll>
            <WidgetScrollContent>
                {media
                    .filter(
                        ({ media_type }) =>
                            media_type === 'IMAGE' ||
                            media_type === 'CAROUSEL_ALBUM'
                    )
                    .map((post) => (
                        <WidgetScrollInstagramItem key={post.id} post={post} />
                    ))}
            </WidgetScrollContent>
        </WidgetScroll>
    )
}

function WidgetScrollInstagramItem({
    post,
}: {
    post: {
        id: string
        permalink?: string
        media_url: string
        caption?: string
        timestamp: string
    }
}) {
    return (
        <WidgetScrollItem href={post.permalink}>
            <WidgetScrollItemImage mediaUrl={post.media_url} />
            <WidgetScrollItemFooter>
                <WidgetScrollItemCaption>{post.caption}</WidgetScrollItemCaption>
                <WidgetScrollItemTimestamp>
                    {!!post.timestamp &&
                        formatDistanceToNow(new Date(post.timestamp), {
                            addSuffix: true,
                        })}
                </WidgetScrollItemTimestamp>
            </WidgetScrollItemFooter>
        </WidgetScrollItem>
    )
}
