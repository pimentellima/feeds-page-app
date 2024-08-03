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
import { getUser } from '@/services/user'
import { Separator } from '@radix-ui/react-separator'
import { CircleCheckIcon, CrownIcon, SquareArrowRightIcon } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { AccountSettingsDropdown } from './account-settings-dropdown'
import { ChangeGridDropdown } from './change-grid-dropdown'
import ChangeImageDialog from './change-image-dialog'
import ChangeThemeDropdown from './change-theme-dropdown'
import { CustomizeWidgetsPanel } from './customize-widgets-panel'
import EditProfileDialog from './edit-profile-dialog'
import { SocialLinkDialog } from './social-link-dialog'
import BuyPlanButton from './buy-plan-button'
import { getSubscriptionByUserId } from '@/services/subscriptions'

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
                className="absolute top-3 sm:top-5 sm:right-14 
                    flex items-center justify-between sm:justify-normal
                     gap-1 w-full px-6 sm:w-auto sm:px-0"
            >
                <ChangeThemeDropdown />
                <div className="hidden sm:block">
                    <ChangeGridDropdown selectedSize={user.gridSize ?? 2} />
                </div>
                <AccountSettingsDropdown
                    hasLifetimePlan={!!subscription}
                    integrations={user.integrationTokens}
                />
            </div>
            <div
                className="sm:grid sm:grid-cols-[4fr,10fr] sm:gap-44 sm:min-h-screen bg-background
                    flex flex-col px-6 sm:px-0"
            >
                <div className="sm:fixed sm:top-0 mt-20 sm:h-[80vh]">
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
                                <BuyPlanButton styled />
                            ) : user.username ? (
                                <Button variant={'outline'} asChild>
                                    <Link
                                        target="_blank"
                                        href={'/' + user.username}
                                    >
                                        <SquareArrowRightIcon className="h-4 w-4 mr-1" />{' '}
                                        Visit your page
                                    </Link>
                                </Button>
                            ) : (
                                <EditProfileDialog
                                    user={user}
                                    trigger={
                                        <Button variant={'default'}>
                                            <CircleCheckIcon className="h-4 w-4 mr-1" />
                                            Claim username
                                        </Button>
                                    }
                                />
                            )}
                        </ProfileSectionFooter>
                    </ProfileSection>
                </div>
                <div className="sm:hidden">
                    <Separator className="my-2" />
                </div>
                <WidgetGrid gridSize={user.gridSize ?? 2}>
                    <CustomizeWidgetsPanel
                        userId={user.id}
                        userWidgets={user.widgets}
                    />
                </WidgetGrid>
            </div>
        </>
    )
}
