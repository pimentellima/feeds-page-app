import DeleteWidgetPopover from '@/app/(profile)/profile/customize/delete-widget-popover'
import { integrationTokens } from '@/drizzle/schema'
import { getInstagramProfileAndMedia } from '@/lib/api-helpers/instagram'
import { refreshIntegrationAccessTokens } from '@/services/integration-tokens'
import { formatDistanceToNow } from 'date-fns'
import { InferSelectModel } from 'drizzle-orm'
import { InstagramIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardHeader } from './ui/card'
import { ScrollArea } from './ui/scroll-area'
import { Separator } from './ui/separator'

export default async function InstagramWidget({
    accessToken,
    widgetId,
}: {
    accessToken: string
    widgetId?: string
}) {
    const { media, profile } = await getInstagramProfileAndMedia(accessToken)

    return (
        <Card className="text-sm">
            <CardHeader className="grid grid-cols-3">
                <Link
                    className="flex flex-col gap-1 items-center col-start-2"
                    href={`https://instagram.com/${profile.username}`}
                >
                    <InstagramIcon className="text-pink-500 w-5 h-5" />
                    {profile.username}
                </Link>
                <div className="justify-self-end">
                    {widgetId && <DeleteWidgetPopover id={widgetId} />}
                </div>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-80">
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
                                        className="rounded-md h-56 w-48"
                                        src={post.media_url}
                                        alt="Instagram image"
                                        width={500}
                                        height={500}
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
            </CardContent>
        </Card>
    )
}
