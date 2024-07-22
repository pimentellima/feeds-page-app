import { Button } from '@/components/ui/button'
import { socialLinks } from '@/drizzle/schema'
import { auth } from '@/lib/auth'
import { getUser } from '@/services/user'
import { InferSelectModel } from 'drizzle-orm'
import { CircleCheckIcon, SquareArrowRightIcon } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { AccountSettingsDropdown } from './account-settings-dropdown'
import ChangeImageDialog from './change-image-dialog'
import ChangeThemeSelect from './change-theme-dropdown'
import { CustomizeWidgetsPanel } from './customize-widgets-panel'
import EditProfileDialog from './edit-profile-dialog'
import { SocialLinkDialog } from './social-link-dialog'

export default async function CustomizePage() {
    const session = await auth()

    if (!session?.user) {
        redirect('/sign-in')
    }

    const user = await getUser(session.user.id)

    return (
        <>
            <div className="absolute top-5 right-14 flex items-center gap-1">
                <ChangeThemeSelect />
                <AccountSettingsDropdown />
            </div>
            <div className="grid grid-cols-[4fr,10fr] gap-44 min-h-screen bg-background">
                <div className="fixed top-0 mt-20 pb-32 h-full ">
                    <div className="flex flex-col ">
                        <div className="pl-14">
                            <ChangeImageDialog
                                imageUrl={user?.imageUrl || ''}
                            />
                        </div>
                        <div className="pl-10 mt-1">
                            <EditProfileDialog
                                user={user}
                                trigger={
                                    <button
                                        title="Edit profile"
                                        className="rounded-md transition-colors w-96
                                        p-3 text-left hover:bg-accent hover:text-accent-foreground"
                                    >
                                        <p className="w-full text-4xl font-bold">
                                            {user.name || 'No name set'}
                                        </p>
                                        <p className="mt-2 line-clamp-4 text-lg font-normal">
                                            {user.bio || 'No bio'}
                                        </p>
                                    </button>
                                }
                            />
                        </div>
                    </div>
                    <div className="mt-10 pl-10">
                        <ShortLinks userLinks={user.socialLinks} />
                    </div>
                    <div className="mt-10 pl-10">
                        {user.username ? (
                            <Button variant={'secondary'} asChild>
                                <Link href={'/' + user.username}>
                                    <SquareArrowRightIcon className="h-4 w-4 mr-1" />{' '}
                                    Visit your page
                                </Link>
                            </Button>
                        ) : (
                            <EditProfileDialog
                                user={user}
                                trigger={
                                    <Button variant={'secondary'}>
                                        <CircleCheckIcon className="h-4 w-4 mr-1" />
                                        Claim username
                                    </Button>
                                }
                            />
                        )}
                    </div>
                </div>
                <div className="col-start-2 grid grid-cols-2 grid-rows-2 gap-4 pt-20 pb-10 pr-16">
                    <CustomizeWidgetsPanel
                        userId={user.id}
                        userWidgets={user.widgets}
                    />
                </div>
            </div>
        </>
    )
}

function ShortLinks({
    userLinks,
}: {
    userLinks: InferSelectModel<typeof socialLinks>[]
}) {
    return (
        <div className="flex gap-1">
            {userLinks.map((link) => (
                <SocialLinkDialog
                    userLinks={userLinks}
                    key={link.id}
                    socialLink={link}
                />
            ))}
            {userLinks.length < 6 && (
                <SocialLinkDialog userLinks={userLinks} key="add_social_link" />
            )}
        </div>
    )
}
