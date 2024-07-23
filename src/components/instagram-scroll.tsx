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
                        <ScrollItem href={post.permalink} key={post.id}>
                            <ScrollItemImage mediaUrl={post.media_url} />
                            <ScrollItemFooter>
                                <ScrollItemCaption>
                                    {post.caption}
                                </ScrollItemCaption>
                                <ScrollItemTimestamp>
                                    {formatDistanceToNow(
                                        new Date(post.timestamp),
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
