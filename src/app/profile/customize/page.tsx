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
import { Instagram, LinkIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import LinkInstagramDialog from './link-instagram-dialog'
import LogoutButton from './logout-button'
import AddIntegrationDialog from './add-integration-dialog'
import { Button } from '@/components/ui/button'
import AddLinkDialog from './add-link-dialog'

export default async function CustomizePage() {
    const session = await auth()

    if (!session?.user) {
        redirect('/sign-in')
    }

    const user = await getUser(session.user.id)

    if (!user) {
        redirect('/sign-in')
    }

    const instagramAccessToken = user?.instagramAccessToken

    const userMedia = instagramAccessToken
        ? await getUserInstagramMedia(instagramAccessToken)
        : undefined

    const userProfile = instagramAccessToken
        ? await getUserInstagramProfile(instagramAccessToken)
        : undefined

    return (
        <div className="flex flex-col justify-center items-center h-screen space-y-4">
            <div className="flex items-center gap-5">
                {userMedia && userProfile && (
                    <InstagramWidget profile={userProfile} media={userMedia} />
                )}
                <div className="flex flex-col gap-1">
                    <AddIntegrationDialog user={user} />
                    <AddLinkDialog user={user} />
                </div>
            </div>
            <LogoutButton />
            {/* <LinkInstagramDialog userProfile={userProfile} /> */}
        </div>
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
            <ScrollArea className="h-72 w-80">
                <div className="grid gap-2">
                    {media
                        .filter(
                            ({ media_type }) =>
                                media_type === 'IMAGE' ||
                                media_type === 'CAROUSEL_ALBUM'
                        )
                        .map((post) => (
                            <div
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
                            </div>
                        ))}
                </div>
            </ScrollArea>
        </div>
    )
}
