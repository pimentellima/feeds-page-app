import TiktokIcon from '@/components/tiktok-icon'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { accountLinks, userLinks, users } from '@/drizzle/schema'
import { getInstagramProfileAndMedia } from '@/lib/api-helpers/instagram'
import { getTiktokProfileAndMedia } from '@/lib/api-helpers/tiktok'
import { auth } from '@/lib/auth'
import { getUrlType, getYoutubeThumbnailFromUrl } from '@/lib/utils'
import { refreshAccountLinkAccessToken } from '@/services/accountLinks'
import { getUser } from '@/services/user'
import { format, formatDistanceToNow } from 'date-fns'
import { InferSelectModel } from 'drizzle-orm'
import {
    EyeIcon,
    InstagramIcon,
    LinkIcon,
    MessageCircleIcon,
    PlayIcon,
    RepeatIcon,
    XIcon,
    YoutubeIcon,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import AddFeedDialog from './add-feed-dialog'
import AddLinkDialog from './add-link-dialog'
import ChangeImageDialog from './change-image-dialog'
import DeleteIntegrationPopover from './delete-integration-popover'
import EditProfileDialog from './edit-profile-dialog'
import LogoutButton from './logout-button'
import PairAccountButton from './pair-account-button'
import { ThemeDropdown } from './theme-dropdown'

export default async function CustomizePage() {
    const session = await auth()

    if (!session?.user) {
        redirect('/sign-in')
    }

    const user = await getUser(session.user.id)

    if (!user) {
        redirect('/404')
    }

    return (
        <div className="bg-gradient flex justify-center items-center min-h-screen pt-10 pb-24">
            <div className="grid items-center gap-5 w-1/2">
                <div className="grid justify-center items-center text-center p-3 bg-card border rounded-md">
                    <div className="flex justify-center">
                        <ChangeImageDialog imageUrl={user?.imageUrl || ''} />
                    </div>
                    <EditProfileDialog user={user} />
                </div>
                <TiktokWidget user={user} />
                <InstagramWidget user={user} />
                {user.links.length > 0 &&
                    user.links.map((socialLink) => (
                        <SocialLink
                            socialLink={socialLink}
                            key={socialLink.id}
                        />
                    ))}
            </div>
            <div className="shadow-md rounded-md fixed bottom-5 p-3 bg-card text-card-foreground flex gap-1">
                <LogoutButton />
                <AddFeedDialog />
                <AddLinkDialog />
            </div>
            <div className="fixed top-5 right-5">
                <ThemeDropdown />
            </div>
        </div>
    )
}

function SocialLink({
    socialLink,
}: {
    socialLink: InferSelectModel<typeof userLinks>
}) {
    const type = getUrlType(socialLink.url)

    return (
        <AddLinkDialog
            link={socialLink}
            trigger={
                <Button
                    variant="outline"
                    className="bg-card hover:bg-card flex flex-col h-full gap-1 items-center"
                >
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
                    {socialLink.title}
                    {socialLink.showThumbnail && (
                        <Image
                            className="rounded-md border"
                            src={getYoutubeThumbnailFromUrl(socialLink.url)}
                            alt="Thumbnail image"
                            width={150}
                            height={150}
                        />
                    )}
                </Button>
            }
        />
    )
}

async function TiktokWidget({
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

async function InstagramWidget({
    user,
}: {
    user: InferSelectModel<typeof users> & {
        accountLinks: InferSelectModel<typeof accountLinks>[]
    }
}) {
    const accountLink = user.accountLinks.find(
        (link) => link.type === 'instagram'
    )

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
                        <InstagramIcon className="text-pink-500 w-4 h-4" />
                        <p>Instagram Feed</p>
                    </div>
                    <DeleteIntegrationPopover id={accountLink.id} />
                </div>
                <PairAccountButton
                    label="Click to pair your Instagram account"
                    link={process.env.NEXT_PUBLIC_URL! + '/api/ig'}
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
                        <InstagramIcon className="text-pink-500 w-4 h-4" />
                        <p>Instagram Feed</p>
                    </div>
                    <DeleteIntegrationPopover id={accountLink.id} />
                </div>
                <PairAccountButton
                    label="Your Instagram account has been disconnected. Click to reconnect"
                    link={process.env.NEXT_PUBLIC_URL! + '/api/instagram'}
                />
            </div>
        )

    const { media, profile } = await getInstagramProfileAndMedia(accessToken)

    return (
        <div
            className="rounded-md bg-card text-card-foreground text-sm
         tracking-tight leading-none border p-3"
        >
            <div className="mb-3">
                <Link
                    className="flex gap-2 justify-center"
                    href={`https://instagram.com/${profile.username}`}
                >
                    <InstagramIcon className="text-pink-500 w-4 h-4" />
                    {profile.username}
                </Link>
            </div>
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
        </div>
    )
}
