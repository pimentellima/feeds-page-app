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
import TiktokWidget from './tiktok-widget'
import InstagramWidget from './instagram-widget'

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
