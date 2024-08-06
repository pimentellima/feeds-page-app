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

export default function InstagramScroll({ media }: { media: InstagramPost[] }) {
    return (
        <Scroll>
            <ScrollContent>
                {media
                    .filter(
                        ({ media_type }) =>
                            media_type === 'IMAGE' ||
                            media_type === 'CAROUSEL_ALBUM'
                    )
                    .map((post) => (
                        <InstagramScrollItem key={post.id} post={post} />
                    ))}
            </ScrollContent>
        </Scroll>
    )
}

export function InstagramScrollItem({
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
        <ScrollItem href={post.permalink}>
            <ScrollItemImage mediaUrl={post.media_url} />
            <ScrollItemFooter>
                <ScrollItemCaption>{post.caption}</ScrollItemCaption>
                <ScrollItemTimestamp>
                    {!!post.timestamp &&
                        formatDistanceToNow(new Date(post.timestamp), {
                            addSuffix: true,
                        })}
                </ScrollItemTimestamp>
            </ScrollItemFooter>
        </ScrollItem>
    )
}
