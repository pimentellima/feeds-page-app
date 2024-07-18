import TiktokIcon from '@/components/tiktok-icon'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { integrationTokens } from '@/drizzle/schema'
import { getTiktokProfileAndMedia } from '@/lib/api-helpers/tiktok'
import { refreshIntegrationAccessTokens } from '@/services/integration-tokens'
import { format, formatDistanceToNow } from 'date-fns'
import { InferSelectModel } from 'drizzle-orm'
import { EyeIcon, MessageCircleIcon, PlayIcon, RepeatIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import PairAccountButton from './pair-account-button'
import Widget from './widget'

export default async function TiktokWidget({
    widgetId,
    token,
}: {
    widgetId: string
    token?: InferSelectModel<typeof integrationTokens> | null
}) {
    if (!token)
        return (
            <Widget
                widgetId={widgetId}
                content={
                    <PairAccountButton
                        label="Click to pair your TikTok account"
                        link={process.env.NEXT_PUBLIC_URL! + '/api/tiktok'}
                    />
                }
                header={
                    <>
                        <TiktokIcon className="fill-foreground w-5 h-5" />
                        <p>Tiktok Feed</p>
                    </>
                }
            />
        )

    const accessToken =
        token.expiresAt && new Date() > token.expiresAt
            ? (await refreshIntegrationAccessTokens(token, 'tiktokIntegration'))
                  ?.accessToken
            : token.accessToken

    if (!accessToken)
        return (
            <Widget
                widgetId={widgetId}
                content={
                    <PairAccountButton
                        label="Your TikTok account has been disconnected. Click to reconnect"
                        link={process.env.NEXT_PUBLIC_URL! + '/api/tiktok'}
                    />
                }
                header={
                    <>
                        <TiktokIcon className="fill-foreground w-5 h-5" />
                        <p>Tiktok Feed</p>
                    </>
                }
            />
        )

    const {
        mediaData: { videos },
        profileData: { user: tiktokUser },
    } = await getTiktokProfileAndMedia(accessToken)

    return (
        <Widget
            widgetId={widgetId}
            content={
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
            }
            header={
                <>
                    <Link
                        href={tiktokUser.profile_deep_link}
                        className="flex flex-col gap-1 items-center"
                    >
                        <TiktokIcon className="fill-foreground w-5 h-5" />
                        <p>{tiktokUser.username}</p>
                    </Link>
                </>
            }
        />
    )
}
