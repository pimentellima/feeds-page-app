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
import { Separator } from './ui/separator'

export default function TiktokScroll({ media }: { media: TiktokMedia[] }) {
    return (
        <Scroll>
            <ScrollContent>
                {media.map((post) => (
                    <ScrollItem href={post.share_url} key={post.id}>
                        <ScrollItemImage mediaUrl={post.cover_image_url} />
                        <ScrollItemFooter>
                            <ScrollItemCaption>{post.title}</ScrollItemCaption>
                            <ScrollItemTimestamp>
                                {formatDistanceToNow(
                                    new Date(post.create_time * 1000),
                                    { addSuffix: true }
                                )}
                            </ScrollItemTimestamp>
                        </ScrollItemFooter>
                        <Separator className="my-4 group-last:hidden" />
                    </ScrollItem>
                ))}
            </ScrollContent>
        </Scroll>
    )
}
