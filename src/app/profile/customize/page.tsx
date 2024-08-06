import {
    ProfileSection,
    ProfileSectionContent,
    ProfileSectionFooter,
    ProfileSectionImage,
    ProfileSectionInfo,
    ProfileSectionInfoContainer,
    ProfileSectionLinks,
} from '@/components/profile-section'
import { Button } from '@/components/ui/button'
import { WidgetGrid } from '@/components/widget'
import { auth } from '@/lib/auth'
import { getSubscriptionByUserId } from '@/services/subscriptions'
import { getUser } from '@/services/user'
import { Separator } from '@radix-ui/react-separator'
import { CircleCheckIcon, SquareArrowRightIcon } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { SignOutButton } from './sign-out-button'
import ChangeImageDialog from './change-image-dialog'
import ChangeThemeDropdown from './change-theme-dropdown'
import { EditLayoutDropdown } from './edit-layout-dropdown'
import EditProfileDialog from './edit-profile-dialog'
import ManageIntegrationsDialog from './manage-integrations-dialog'
import { SocialLinkDialog } from './social-link-dialog'
import TimelineScroll from './timeline-scroll'
import UpgradePlanDialog from './upgrade-plan-dialog'
import { WidgetsEditPanel } from './widgets-edit-panel'

export default async function CustomizePage() {
    const session = await auth()

    if (!session?.user) {
        redirect('/sign-in')
    }

    const user = await getUser(session.user.id)
    const subscription = await getSubscriptionByUserId(session.user.id)

    return (
        <>
            <div
                className="absolute top-3 lg:top-5 lg:right-14 
                    flex items-center justify-between lg:justify-normal
                     gap-1 w-full px-6 lg:w-auto lg:px-0"
            >
                <ChangeThemeDropdown />
                <div className="hidden lg:block">
                    <EditLayoutDropdown layout={user.layout} />
                </div>
                <ManageIntegrationsDialog
                    integrations={user.integrationTokens}
                />
                <SignOutButton />
            </div>
            <div
                className="lg:grid lg:grid-cols-[4fr,10fr] lg:gap-44 lg:min-h-screen bg-background
                    flex flex-col px-6 lg:px-0"
            >
                <div className="lg:fixed lg:top-0 mt-20 lg:h-[80vh]">
                    <ProfileSection>
                        <ProfileSectionContent>
                            <ProfileSectionImage>
                                <ChangeImageDialog
                                    imageUrl={user.imageUrl || undefined}
                                />
                            </ProfileSectionImage>
                            <ProfileSectionInfoContainer>
                                <EditProfileDialog
                                    user={{
                                        bio: user.bio,
                                        location: user.location,
                                        name: user.name,
                                        username: user.username,
                                    }}
                                    trigger={
                                        <button
                                            className="transition-colors hover:bg-accent rounded-md"
                                            title="Edit profile"
                                        >
                                            <ProfileSectionInfo user={user} />
                                        </button>
                                    }
                                />
                            </ProfileSectionInfoContainer>
                        </ProfileSectionContent>
                        <ProfileSectionLinks>
                            <>
                                {user.socialLinks.map((link) => (
                                    <SocialLinkDialog
                                        userLinks={user.socialLinks}
                                        key={link.id}
                                        socialLink={link}
                                    />
                                ))}
                                {user.socialLinks.length < 6 && (
                                    <SocialLinkDialog
                                        userLinks={user.socialLinks}
                                        key="add_social_link"
                                    />
                                )}
                            </>
                        </ProfileSectionLinks>
                        <ProfileSectionFooter>
                            {!subscription ? (
                                <UpgradePlanDialog />
                            ) : user.username ? (
                                <Button variant={'outline'} asChild>
                                    <Link
                                        target="_blank"
                                        href={'/' + user.username}
                                    >
                                        <SquareArrowRightIcon className="h-4 w-4 mr-1" />
                                        Visit your page
                                    </Link>
                                </Button>
                            ) : (
                                <EditProfileDialog
                                    user={user}
                                    trigger={
                                        <Button variant={'outline'}>
                                            <CircleCheckIcon className="h-4 w-4 mr-1" />
                                            Claim username to deploy
                                        </Button>
                                    }
                                />
                            )}
                        </ProfileSectionFooter>
                    </ProfileSection>
                </div>
                <div className="lg:hidden">
                    <Separator className="my-2" />
                </div>
                {user.layout === 'list' ? (
                    <div
                        className="flex flex-col gap-4 col-start-2 lg:grid
                            lg:gap-4 lg:mt-20 pb-10 lg:pr-16 pt-5 lg:pt-0 font-sans"
                    >
                        {user.integrationTokens.length === 0 ? (
                            <span className="h-min rounded-md border p-4 text-center">
                                No integrations. Click on Integrations to add a
                                new
                            </span>
                        ) : (
                            <TimelineScroll userId={user.id} />
                        )}
                    </div>
                ) : (
                    <WidgetGrid
                        gridSize={
                            user.layout === 'grid1x1'
                                ? 1
                                : user.layout === 'grid3x3'
                                ? 3
                                : 2
                        }
                    >
                        <WidgetsEditPanel
                            userId={user.id}
                            userWidgets={user.widgets}
                        />
                    </WidgetGrid>
                )}
            </div>
        </>
    )
}
