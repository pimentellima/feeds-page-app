import InstagramWidget from '@/components/instagram-widget'
import TiktokWidget from '@/components/tiktok-widget'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import UserAvatar from '@/components/user-avatar'
import { links } from '@/drizzle/schema'
import { getUrlType, getYoutubeThumbnailFromUrl } from '@/lib/utils'
import { refreshIntegrationAccessTokens } from '@/services/integration-tokens'
import { getUserByUsername } from '@/services/user'
import { InferSelectModel } from 'drizzle-orm'
import { InstagramIcon, LinkIcon, XIcon, YoutubeIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default async function UserPage({
    params,
}: {
    params: { username: string }
}) {
    const user = await getUserByUsername(params.username)

    return (
        <div className="bg-gradient flex justify-center items-center min-h-screen py-8">
            <div className="grid items-center gap-5 w-1/2">
                <div className="grid justify-center items-center text-center">
                    <div className="flex justify-center">
                        <UserAvatar />
                    </div>
                    <div
                        className="mt-1 rounded-md font-medium transition-colors
                        px-4 py-2 max-w-96"
                    >
                        <p className="underline-offset-4 w-full">
                            {user.username || 'No username'}
                        </p>
                        <p className="overflow-hidden whitespace-nowrap text-ellipsis">
                            {user.bio || 'No bio'}
                        </p>
                    </div>
                </div>
                {user.widgets.map(async (widget) => {
                    if (widget.link) {
                        return <LinkWidget link={widget.link} key={widget.id} />
                    }
                    if (
                        widget.type === 'tiktokIntegration' &&
                        widget.integrationToken
                    ) {
                        const accessToken =
                            widget.integrationToken.expiresAt &&
                            new Date() > widget.integrationToken.expiresAt
                                ? (
                                      await refreshIntegrationAccessTokens(
                                          widget.integrationToken,
                                          'tiktokIntegration'
                                      )
                                  )?.accessToken
                                : widget.integrationToken.accessToken

                        if (!accessToken) return null

                        return (
                            <TiktokWidget
                                accessToken={accessToken}
                                key={widget.id}
                            />
                        )
                    }
                    if (
                        widget.type === 'instagramIntegration' &&
                        widget.integrationToken
                    ) {
                        const accessToken =
                            widget.integrationToken.expiresAt &&
                            new Date() > widget.integrationToken.expiresAt
                                ? (
                                      await refreshIntegrationAccessTokens(
                                          widget.integrationToken,
                                          'instagramIntegration'
                                      )
                                  )?.accessToken
                                : widget.integrationToken.accessToken

                        if (!accessToken) return null

                        return (
                            <InstagramWidget
                                accessToken={accessToken}
                                key={widget.id}
                            />
                        )
                    }
                })}
            </div>
        </div>
    )
}

function LinkWidget({ link }: { link: InferSelectModel<typeof links> }) {
    const type = getUrlType(link.url)

    return (
        <Link href={link.url}>
            <Card className="text-sm">
                <CardHeader className="grid grid-cols-3">
                    <div className="col-start-2 justify-self-center">
                        <div className="flex flex-col gap-1 items-center">
                            {type === 'youtube' && (
                                <YoutubeIcon className="text-red-500 h-5 w-5" />
                            )}
                            {type === 'instagram' && (
                                <InstagramIcon className="text-pink-500 h-5 w-5" />
                            )}
                            {(type === 'twitter' || type === 'x') && (
                                <XIcon className="h-5 w-5 text-foreground" />
                            )}
                            {type === 'other' && (
                                <LinkIcon className="h-5 w-5 text-gray-500" />
                            )}
                            {link.title}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="flex justify-center">
                    {link.showThumbnail && (
                        <Image
                            className="rounded-md border"
                            src={getYoutubeThumbnailFromUrl(link.url)}
                            alt="Thumbnail image"
                            width={200}
                            height={200}
                        />
                    )}
                </CardContent>
            </Card>
        </Link>
    )
}
