import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { auth } from '@/lib/auth'
import {
    getUser,
    getUserInstagramMedia,
    getUserInstagramProfile,
    InstagramPost,
    InstagramProfile,
} from '@/services/user'
import { formatDistanceToNow } from 'date-fns'
import {
    Instagram,
    InstagramIcon,
    LinkIcon,
    PencilIcon,
    UserIcon,
    XIcon,
    YoutubeIcon,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import AddIntegrationDialog from './add-integration-dialog'
import AddLinkDialog from './add-link-dialog'
import LogoutButton from './logout-button'
import { InferSelectModel } from 'drizzle-orm'
import { userLinks, users } from '@/drizzle/schema'
import { getUrlType, getYoutubeThumbnailFromUrl } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import ChangeBioDialog from './change-bio-dialog'
import ChangeImageDialog from './change-image-dialog'

export default async function CustomizePage() {
    const session = await auth()

    if (!session?.user) {
        redirect('/sign-in')
    }

    const user = await getUser(session.user.id)

    if (!user) {
        redirect('/404')
    }

    const instagramAccessToken = user?.instagramAccessToken

    const instagramMedia = instagramAccessToken
        ? await getUserInstagramMedia(instagramAccessToken)
        : undefined

    const instagramProfile = instagramAccessToken
        ? await getUserInstagramProfile(instagramAccessToken)
        : undefined

    return (
        <div className="flex justify-center items-center min-h-screen pt-10 pb-24">
            <div className="grid items-center gap-5 w-80 ">
                <ProfileInfo user={user} />
                {instagramMedia && instagramProfile && (
                    <InstagramWidget
                        profile={instagramProfile}
                        media={instagramMedia}
                    />
                )}
                {user.links.length > 0 &&
                    user.links.map((socialLink) => (
                        <SocialLink
                            socialLink={socialLink}
                            key={socialLink.id}
                        />
                    ))}
            </div>
            <div className="fixed bottom-5 p-3 bg-card text-card-foreground flex gap-1">
                <LogoutButton />
                <AddIntegrationDialog />
                <AddLinkDialog />
            </div>
        </div>
    )
}

function ProfileInfo({ user }: { user: InferSelectModel<typeof users> }) {
    return (
        <div className="w-80 flex flex-col justify-center items-center text-center p-3 bg-card border rounded-md">
            <div className="flex justify-center">
                <ChangeImageDialog />
            </div>
            <div className="grid grid-cols-[6fr,1fr] gap-1 place-items-center mt-1">
                <p className="text-sm tracking-tight line-clamp-2">
                    {user.bio || 'No bio'}
                </p>
                <ChangeBioDialog bio={user?.bio || ''} />
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
                    {type === 'youtube' && <YoutubeIcon className='h-5 w-5' />}
                    {type === 'instagram' && <InstagramIcon className='h-5 w-5' />}
                    {(type === 'twitter' || type === 'x') && <XIcon className='h-5 w-5' />}
                    {type === 'other' && <LinkIcon className='h-5 w-5' />}
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

function InstagramWidget({
    profile,
    media,
}: {
    profile: InstagramProfile
    media: InstagramPost[]
}) {
    return (
        <div
            className="rounded-md bg-card text-card-foreground text-sm
         tracking-tight leading-none border p-3 "
        >
            <div className="mb-3">
                <Link
                    className="flex gap-2 items-center"
                    href={`https://instagram.com/${profile.username}`}
                >
                    <Instagram className="w-4 h-4" />
                    {profile.username}
                </Link>
            </div>
            <ScrollArea className="h-72">
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
                                    <p className="line-clamp-3">
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
