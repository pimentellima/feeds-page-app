import { getInstagramMedia } from '@/app/actions/get-instagram-media'
import { getTiktokMedia } from '@/app/actions/get-tiktok-media'
import InstagramMediaScroll from '@/components/instagram-feed'
import TiktokVideosScroll from '@/components/tiktok-videos-scroll'
import TiktokIcon from '@/components/tiktok-icon'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import UserAvatar from '@/components/user-avatar'
import { links } from '@/drizzle/schema'
import { getUrlType, getYoutubeThumbnailFromUrl } from '@/lib/utils'
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
                    if (widget.type === 'tiktokIntegration') {
                        const media = await getTiktokMedia(user.id)

                        if (!media) return null

                        return (
                            <Card className="text-sm">
                                <CardHeader className="grid grid-cols-3">
                                    <div
                                        className="col-start-2 justify-self-center 
                                            flex flex-col items-center gap-1"
                                    >
                                        <TiktokIcon className="fill-foreground w-5 h-5" />
                                        <p>{media.user.username}</p>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <TiktokVideosScroll videos={media.videos} />
                                </CardContent>
                            </Card>
                        )
                    }

                    if (widget.type === 'instagramIntegration') {
                        const media = await getInstagramMedia(user.id)

                        if (!media) return null

                        return (
                            <Card className="text-sm">
                                <CardHeader className="grid grid-cols-3">
                                    <div
                                        className="col-start-2 justify-self-center 
                                            flex flex-col items-center gap-1"
                                    >
                                        <InstagramIcon className="text-pink-500 w-5 h-5" />
                                        <p>{media.profile.username}</p>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <InstagramMediaScroll media={media.media} />
                                </CardContent>
                            </Card>
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
