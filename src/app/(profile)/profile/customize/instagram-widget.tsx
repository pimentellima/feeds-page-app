import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { integrationTokens } from '@/drizzle/schema'
import { getInstagramProfileAndMedia } from '@/lib/api-helpers/instagram'
import { refreshIntegrationAccessTokens } from '@/services/integration-tokens'
import { formatDistanceToNow } from 'date-fns'
import { InferSelectModel } from 'drizzle-orm'
import { InstagramIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import PairAccountButton from './pair-account-button'
import Widget from './widget'

export default async function InstagramWidget({
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
                        label="Click to pair your Instagram account."
                        link={process.env.NEXT_PUBLIC_URL! + '/api/instagram'}
                    />
                }
                header={
                    <>
                        <InstagramIcon className="text-pink-500 w-5 h-5" />
                        <p>Instagram Feed</p>
                    </>
                }
            />
        )

    const accessToken =
        token.expiresAt && new Date() > token.expiresAt
            ? (
                  await refreshIntegrationAccessTokens(
                      token,
                      'instagramIntegration'
                  )
              )?.accessToken
            : token.accessToken

    if (!accessToken)
        return (
            <Widget
                widgetId={widgetId}
                content={
                    <PairAccountButton
                        label="Your Instagram account has been disconnected. Click to reconnect"
                        link={process.env.NEXT_PUBLIC_URL! + '/api/instagram'}
                    />
                }
                header={
                    <>
                        <InstagramIcon className="text-pink-500 w-5 h-5" />
                        <p>Instagram Feed</p>
                    </>
                }
            />
        )

    const { media, profile } = await getInstagramProfileAndMedia(accessToken)

    return (
        <Widget
            widgetId={widgetId}
            content={
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
            }
            header={
                <>
                    <InstagramIcon className="text-pink-500 w-5 h-5" />
                    {profile.username}
                </>
            }
        />
    )
}
