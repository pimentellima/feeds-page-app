import { TiktokMedia } from '@/lib/api-helpers/tiktok'
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

export default function TiktokScroll({ media }: { media: TiktokMedia[] }) {
    return (
        <Scroll>
            <ScrollContent>
                {media.map((post) => (
                    <TiktokScrollItem key={post.id} post={post} />
                ))}
            </ScrollContent>
        </Scroll>
    )
}

export function TiktokScrollItem({
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
        <ScrollItem href={post.share_url} key={post.id}>
            <ScrollItemImage mediaUrl={post.cover_image_url} />
            <ScrollItemFooter>
                <ScrollItemCaption>{post.title}</ScrollItemCaption>
                <ScrollItemTimestamp>
                    {!!post.create_time &&
                        formatDistanceToNow(new Date(post.create_time * 1000), {
                            addSuffix: true,
                        })}
                </ScrollItemTimestamp>
            </ScrollItemFooter>
        </ScrollItem>
    )
}
