import DeleteWidgetPopover from '@/app/(profile)/profile/customize/delete-widget-popover'
import { getTiktokProfileAndMedia } from '@/lib/api-helpers/tiktok'
import { format, formatDistanceToNow } from 'date-fns'
import { EyeIcon, MessageCircleIcon, PlayIcon, RepeatIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import TiktokIcon from './tiktok-icon'
import { Card, CardContent, CardHeader } from './ui/card'
import { ScrollArea } from './ui/scroll-area'
import { Separator } from './ui/separator'

export default async function TiktokWidget({
    accessToken,
    widgetId,
}: {
    accessToken: string
    widgetId?: string
}) {
    const {
        mediaData: { videos },
        profileData: { user: tiktokUser },
    } = await getTiktokProfileAndMedia(accessToken)

    return (
        <Card className="text-sm">
            <CardHeader className="grid grid-cols-3">
                <Link
                    href={tiktokUser.profile_deep_link}
                    className="col-start-2 flex flex-col gap-1 items-center"
                >
                    <TiktokIcon className="fill-foreground w-5 h-5" />
                    <p>{tiktokUser.username}</p>
                </Link>
                <div className="justify-self-end">
                    {widgetId && <DeleteWidgetPopover id={widgetId} />}
                </div>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-80">
                    <div className="grid gap-2">
                        {videos.map((video) => (
                            <Link
                                href={video.share_url || '/404'}
                                key={video.id}
                                className="flex flex-col justify-center items-center group"
                            >
                                <div className="relative bg-black rounded-md">
                                    <div
                                        className="absolute flex items-center gap-1 bottom-2 
                                right-2 z-10 rounded-md bg-black/20 text-white text-xs px-2 py-1"
                                    >
                                        <PlayIcon className="w-3 h-3 text-white fill-white" />
                                        {format(
                                            new Date(video.duration * 1000),
                                            'mm:ss'
                                        )}
                                    </div>
                                    <Image
                                        className="rounded-md h-56 w-48 opacity-80"
                                        src={video.cover_image_url}
                                        alt="Tiktok video cover image"
                                        width={500}
                                        height={500}
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
                                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
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
                                    </div>
                                </div>
                                <Separator className="my-4 group-last:hidden" />
                            </Link>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    )
}
