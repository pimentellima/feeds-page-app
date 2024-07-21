import { InstagramPost } from '@/lib/api-helpers/instagram'
import { formatDistanceToNow } from 'date-fns'
import Image from 'next/image'
import Link from 'next/link'
import { ScrollArea } from './ui/scroll-area'
import { Separator } from './ui/separator'

export default function InstagramScroll({ media }: { media: InstagramPost[] }) {
    return (
        <ScrollArea className="h-96 w-full pb-4">
            <div className="grid gap-2">
                {media
                    .filter(
                        ({ media_type }) =>
                            media_type === 'IMAGE' ||
                            media_type === 'CAROUSEL_ALBUM'
                    )
                    .map((post) => (
                        <Link
                            href={post.permalink || '/404'}
                            key={post.id}
                            className="flex flex-col justify-center items-center group"
                        >
                            <Image
                                className="rounded-md object-contain"
                                quality={100}
                                src={post.media_url}
                                alt="Instagram post image"
                                width={240}
                                height={240}
                            />

                            <div className="flex flex-col gap-1 text-center w-48 mt-2">
                                <p className="overflow-hidden whitespace-nowrap text-ellipsis">
                                    {post.caption}
                                </p>
                                <p className="text-muted-foreground text-xs">
                                    {formatDistanceToNow(
                                        new Date(post.timestamp),
                                        { addSuffix: true }
                                    )}
                                </p>
                            </div>
                            <Separator className="my-4 group-last:hidden" />
                        </Link>
                    ))}
            </div>
        </ScrollArea>
    )
}
