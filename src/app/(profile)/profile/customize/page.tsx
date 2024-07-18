import { links } from '@/drizzle/schema'
import { auth } from '@/lib/auth'
import { getUrlType, getYoutubeThumbnailFromUrl } from '@/lib/utils'
import { getUser } from '@/services/user'
import { InferSelectModel } from 'drizzle-orm'
import { InstagramIcon, LinkIcon, XIcon, YoutubeIcon } from 'lucide-react'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { AddWidgetPopover } from './add-widget-popover'
import ChangeImageDialog from './change-image-dialog'
import EditProfileDialog from './edit-profile-dialog'
import { EditSocialLinkWrapper } from './edit-social-link-wrapper'
import InstagramWidget from './instagram-widget'
import LogoutButton from './logout-button'
import { ThemeDropdown } from './theme-dropdown'
import TiktokWidget from './tiktok-widget'

export default async function CustomizePage() {
    const session = await auth()

    if (!session?.user) {
        redirect('/sign-in')
    }

    const user = await getUser(session.user.id)

    return (
        <div className="bg-gradient flex justify-center items-center min-h-screen pt-10 pb-24">
            <div className="grid items-center gap-5 w-1/2">
                <div className="grid justify-center items-center text-center p-3 bg-card border rounded-md">
                    <div className="flex justify-center">
                        <ChangeImageDialog imageUrl={user?.imageUrl || ''} />
                    </div>
                    <EditProfileDialog user={user} />
                </div>
                {user.widgets.map((widget) => {
                    if (widget.link) {
                        return (
                            <SocialLink
                                link={widget.link}
                                key={widget.id}
                            />
                        )
                    }
                    if (widget.type === 'tiktokIntegration') {
                        return (
                            <TiktokWidget
                                widgetId={widget.id}
                                token={widget.integrationToken}
                                key={widget.id}
                            />
                        )
                    }
                    if (widget.type === 'instagramIntegration') {
                        return (
                            <InstagramWidget
                                widgetId={widget.id}
                                token={widget.integrationToken}
                                key={widget.id}
                            />
                        )
                    }
                })}
            </div>
            <div className="shadow-md rounded-md fixed bottom-5 p-3 bg-card text-card-foreground flex gap-1">
                <LogoutButton />
                <AddWidgetPopover />
            </div>
            <div className="fixed top-5 right-5">
                <ThemeDropdown />
            </div>
        </div>
    )
}

function SocialLink({ link }: { link: InferSelectModel<typeof links> }) {
    const type = getUrlType(link.url)

    return (
        <EditSocialLinkWrapper link={link}>
            <>
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
                {link.showThumbnail && (
                    <Image
                        className="rounded-md border"
                        src={getYoutubeThumbnailFromUrl(link.url)}
                        alt="Thumbnail image"
                        width={150}
                        height={150}
                    />
                )}
            </>
        </EditSocialLinkWrapper>
    )
}
