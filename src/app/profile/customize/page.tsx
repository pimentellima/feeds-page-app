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
import { Instagram } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import AddIntegrationDialog from './add-integration-dialog'
import AddLinkDialog from './add-link-dialog'
import LogoutButton from './logout-button'
import { Button } from '@/components/ui/button'

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
        <div className="flex flex-col justify-center items-center min-h-screen pt-10 pb-20">
            <div className="grid items-center gap-5">
                {instagramMedia && instagramProfile && (
                    <InstagramWidget
                        profile={instagramProfile}
                        media={instagramMedia}
                    />
                )}
                {user.links.length > 0 &&
                    user.links.map((socialLink) => (
                        <AddLinkDialog link={socialLink} key={socialLink.id}>
                            <button
                                className="bg-card text-card-foreground p-2 border text-sm 
                                tracking-tight font-medium rounded-md text-center"
                            >
                                {socialLink.title}
                            </button>
                        </AddLinkDialog>
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
