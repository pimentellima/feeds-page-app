import { TiktokMedia } from '@/lib/api-helpers/tiktok'
import { format, formatDistanceToNow } from 'date-fns'
import { EyeIcon, MessageCircleIcon, PlayIcon, RepeatIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { ScrollArea } from './ui/scroll-area'
import { Separator } from './ui/separator'

export default function TiktokScroll({ media }: { media: TiktokMedia[] }) {
    return (
        <ScrollArea className="h-96 w-full pb-4">
            <div className="grid gap-2">
                {media.map((video) => (
                    <Link
                        href={video.share_url || '/404'}
                        key={video.id}
                        className="flex flex-col justify-center items-center group"
                    >
                        <div className="relative bg-black rounded-md">
                            <div
                                className="absolute flex items-center gap-1 bottom-2 
                                right-2 rounded-md bg-black/20 text-white text-xs px-2 py-1"
                            >
                                <PlayIcon className="w-3 h-3 text-white fill-white" />
                                {format(
                                    new Date(video.duration * 1000),
                                    'mm:ss'
                                )}
                            </div>
                            <Image
                                className="rounded-md object-contain opacity-80"
                                quality={100}
                                src={video.cover_image_url}
                                alt="Tiktok video cover image"
                                width={240}
                                height={240}
                            />
                        </div>
                        <div className="flex flex-col gap-1 text-center w-48 mt-2">
                            <p className="overflow-hidden whitespace-nowrap text-ellipsis">
                                {video.title}
                            </p>
                            <p className="text-muted-foreground text-xs">
                                {formatDistanceToNow(
                                    new Date(video.create_time * 1000),
                                    { addSuffix: true }
                                )}
                            </p>
                          {/*   <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                <p className="flex gap-1 items-center">
                                    <EyeIcon className="h-4 w-4" />
                                    {video.view_count}
                                </p>
                                <p className="flex gap-1 items-center">
                                    <MessageCircleIcon className="h-4 w-4" />
                                    {video.comment_count}
                                </p>
                                <p className="flex gap-1 items-center">
                                    <RepeatIcon className="h-4 w-4" />
                                    {video.share_count}
                                </p>
                            </div> */}
                        </div>
                        <Separator className="my-4 group-last:hidden" />
                    </Link>
                ))}
            </div>
        </ScrollArea>
    )
}
