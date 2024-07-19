import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { links } from '@/drizzle/schema'
import { auth } from '@/lib/auth'
import { getUrlType, getYoutubeThumbnailFromUrl } from '@/lib/utils'
import { getUser } from '@/services/user'
import { InferSelectModel } from 'drizzle-orm'
import {
    EyeIcon,
    InstagramIcon,
    LinkIcon,
    XIcon,
    YoutubeIcon,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ActionsDropdown } from './actions-dropdown'
import ChangeImageDialog from './change-image-dialog'
import DeleteWidgetPopover from './delete-widget-popover'
import EditInstagramWidget from './edit-instagram-widget'
import EditProfileDialog from './edit-profile-dialog'
import { EditSocialLinkWrapper } from './edit-social-link-wrapper'
import EditTiktokWidget from './edit-tiktok-widget'

export default async function CustomizePage() {
    const session = await auth()

    if (!session?.user) {
        redirect('/sign-in')
    }

    const user = await getUser(session.user.id)

    return (
        <div className="bg-gradient flex justify-center items-center min-h-screen py-8">
            <div className="grid items-center gap-5 w-1/2">
                <div className="grid justify-center items-center text-center">
                    <div className="flex justify-center">
                        <ChangeImageDialog imageUrl={user?.imageUrl || ''} />
                    </div>
                    <EditProfileDialog user={user} />
                </div>
                {user.widgets.map((widget) => {
                    if (widget.link) {
                        return (
                            <EditLinkWidget
                                widgetId={widget.id}
                                link={widget.link}
                                key={widget.id}
                            />
                        )
                    }
                    if (widget.type === 'tiktokIntegration') {
                        return (
                            <EditTiktokWidget
                                widgetId={widget.id}
                                token={widget.integrationToken}
                                key={widget.id}
                            />
                        )
                    }
                    if (widget.type === 'instagramIntegration') {
                        return (
                            <EditInstagramWidget
                                widgetId={widget.id}
                                token={widget.integrationToken}
                                key={widget.id}
                            />
                        )
                    }
                })}
            </div>
            <div className="fixed left-14 top-5 flex gap-1">
                <ActionsDropdown />
                {user.username ? (
                    <Button asChild variant={'outline'}>
                        <Link target="_blank" href={`/${user.username}`}>
                            <EyeIcon className="mr-1 h-5 w-5" />
                            Visit page
                        </Link>
                    </Button>
                ) : (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="outline">
                                    <EyeIcon className="mr-1 h-5 w-5" />
                                    See preview
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>
                                    You have to set your username to preview
                                    your page.
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}
            </div>
        </div>
    )
}

function EditLinkWidget({
    widgetId,
    link,
}: {
    widgetId: string
    link: InferSelectModel<typeof links>
}) {
    const type = getUrlType(link.url)

    return (
        <Card className="text-sm">
            <CardHeader className="grid grid-cols-3">
                <div className="col-start-2 justify-self-center">
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
                </div>
                <div className="justify-self-end">
                    <DeleteWidgetPopover id={widgetId} />
                </div>
            </CardHeader>
            <CardContent className="flex justify-center">
                {link.showThumbnail && (
                    <EditSocialLinkWrapper link={link}>
                        <Image
                            className="rounded-md border"
                            src={getYoutubeThumbnailFromUrl(link.url)}
                            alt="Thumbnail image"
                            width={200}
                            height={200}
                        />
                    </EditSocialLinkWrapper>
                )}
            </CardContent>
        </Card>
    )
}
