import TiktokIcon from '@/components/tiktok-icon'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { accountLinks, users } from '@/drizzle/schema'
import { getTiktokProfileAndMedia } from '@/lib/api-helpers/tiktok'
import { refreshAccountLinkAccessToken } from '@/services/accountLinks'
import { format, formatDistanceToNow } from 'date-fns'
import { InferSelectModel } from 'drizzle-orm'
import { EyeIcon, MessageCircleIcon, PlayIcon, RepeatIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import DeleteIntegrationPopover from './delete-integration-popover'
import PairAccountButton from './pair-account-button'

export default async function TiktokWidget({
    user,
}: {
    user: InferSelectModel<typeof users> & {
        accountLinks: InferSelectModel<typeof accountLinks>[]
    }
}) {
    const accountLink = user.accountLinks.find((link) => link.type === 'tiktok')

    if (!accountLink) return null

    if (!accountLink.accessToken)
        return (
            <div
                className="rounded-md bg-card text-card-foreground text-sm
                tracking-tight leading-none border p-3
                flex flex-col items-center justify-center gap-4"
            >
                <div className="flex justify-between w-full">
                    <div />
                    <div className="flex gap-2 items-center">
                        <TiktokIcon className="fill-foreground w-4 h-4" />
                        <p>Tiktok Feed</p>
                    </div>
                    <DeleteIntegrationPopover id={accountLink.id} />
                </div>
                <PairAccountButton
                    label="Click to pair your TikTok account"
                    link={process.env.NEXT_PUBLIC_URL! + '/api/tiktok'}
                />
            </div>
        )

    const accessToken =
        accountLink.expiresAt && new Date() > accountLink.expiresAt
            ? (await refreshAccountLinkAccessToken(accountLink))?.accessToken
            : accountLink.accessToken

    if (!accessToken)
        return (
            <div
                className="rounded-md bg-card text-card-foreground text-sm
                    tracking-tight leading-none border p-3
                    flex flex-col items-center justify-center gap-4"
            >
                <div className="flex justify-between w-full">
                    <div />
                    <div className="flex gap-2 items-center">
                        <TiktokIcon className="fill-foreground w-4 h-4" />
                        <p>Tiktok Feed</p>
                    </div>
                    <DeleteIntegrationPopover id={accountLink.id} />
                </div>
                <PairAccountButton
                    label="Your TikTok account has been disconnected. Click to reconnect"
                    link={process.env.NEXT_PUBLIC_URL! + '/api/tiktok'}
                />
            </div>
        )

    const {
        mediaData: { videos },
        profileData: { user: tiktokUser },
    } = await getTiktokProfileAndMedia(accessToken)

    return (
        <div
            className="rounded-md bg-card text-card-foreground text-sm
            tracking-tight leading-none border p-3 "
        >
            <div className="flex justify-between w-full mb-3">
                <div />
                <Link
                    className="flex gap-2 justify-center"
                    href={tiktokUser.profile_deep_link}
                >
                    <TiktokIcon className="fill-foreground w-4 h-4" />
                    {tiktokUser.username}
                </Link>
                <DeleteIntegrationPopover id={accountLink.id} />
            </div>
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
        </div>
    )
}
