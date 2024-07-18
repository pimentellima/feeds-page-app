import { links, users } from '@/drizzle/schema'
import { auth } from '@/lib/auth'
import { getUrlType, getYoutubeThumbnailFromUrl } from '@/lib/utils'
import { getUser } from '@/services/user'
import { InferSelectModel } from 'drizzle-orm'
import { InstagramIcon, LinkIcon, XIcon, YoutubeIcon } from 'lucide-react'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { ActionsDropdown } from './actions-dropdown'
import ChangeImageDialog from './change-image-dialog'
import EditProfileDialog from './edit-profile-dialog'
import { EditSocialLinkWrapper } from './edit-social-link-wrapper'
import InstagramWidget from './instagram-widget'
import TiktokWidget from './tiktok-widget'
import Widget from './widget'

export default async function CustomizePage() {
    const session = await auth()

    if (!session?.user) {
        redirect('/sign-in')
    }

    const user = await getUser(session.user.id)

    return (
        <div className="bg-gradient flex justify-center items-center min-h-screen py-8">
            <div className="grid items-center gap-5 w-1/2">
                <EditProfileBox user={user} />
                {user.widgets.map((widget) => {
                    if (widget.link) {
                        return (
                            <LinkWidget
                                widgetId={widget.id}
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
            <div className="fixed left-14 top-5">
                <ActionsDropdown />
            </div>
        </div>
    )
}

function LinkWidget({
    widgetId,
    link,
}: {
    widgetId: string
    link: InferSelectModel<typeof links>
}) {
    const type = getUrlType(link.url)

    return (
        <Widget
            widgetId={widgetId}
            content={
                link.showThumbnail ? (
                    <Image
                        className="rounded-md border"
                        src={getYoutubeThumbnailFromUrl(link.url)}
                        alt="Thumbnail image"
                        width={200}
                        height={200}
                    />
                ) : undefined
            }
            header={
                <EditSocialLinkWrapper link={link}>
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
                </EditSocialLinkWrapper>
            }
        />
    )
}

function EditProfileBox({ user }: { user: InferSelectModel<typeof users> }) {
    return (
        <div className="grid justify-center items-center text-center">
            <div className="flex justify-center">
                <ChangeImageDialog imageUrl={user?.imageUrl || ''} />
            </div>
            <EditProfileDialog user={user} />
        </div>
    )
}
