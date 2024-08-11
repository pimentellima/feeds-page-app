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

export default function WidgetScrollTiktok({ media }: { media: TiktokMedia[] }) {
    return (
        <WidgetScroll>
            <WidgetScrollContent>
                {media.map((post) => (
                    <WidgetScrollTiktokItem key={post.id} post={post} />
                ))}
            </WidgetScrollContent>
        </WidgetScroll>
    )
}

function WidgetScrollTiktokItem({
    post,
}: {
    post: {
        share_url: string
        id: string
        cover_image_url: string
        title: string
        create_time: number
    }
}) {
    return (
        <WidgetScrollItem href={post.share_url} key={post.id}>
            <WidgetScrollItemImage mediaUrl={post.cover_image_url} />
            <WidgetScrollItemFooter>
                <WidgetScrollItemCaption>{post.title}</WidgetScrollItemCaption>
                <WidgetScrollItemTimestamp>
                    {!!post.create_time &&
                        formatDistanceToNow(new Date(post.create_time * 1000), {
                            addSuffix: true,
                        })}
                </WidgetScrollItemTimestamp>
            </WidgetScrollItemFooter>
        </WidgetScrollItem>
    )
}
