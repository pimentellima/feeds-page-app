import {
    ProfileSection,
    ProfileSectionContent,
    ProfileSectionImage,
    ProfileSectionInfo,
    ProfileSectionInfoContainer,
    ProfileSectionLinks,
} from '@/components/profile-section'
import { Button } from '@/components/ui/button'
import { WidgetGrid } from '@/components/widget'
import { integrationTokens, users } from '@/drizzle/schema'
import { auth } from '@/lib/auth'
import { getSubscriptionByUserId } from '@/services/subscriptions'
import { getUser } from '@/services/user'
import { InferSelectModel } from 'drizzle-orm'
import { CircleCheckIcon, SquareArrowRightIcon } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ButtonSignOut } from './button-sign-out'
import { DialogCreateSocialLink } from './dialog-create-social-link'
import DialogEditIntegrations from './dialog-edit-integrations'
import DialogEditProfile from './dialog-edit-profile'
import DialogEditProfileImage from './dialog-edit-profile-image'
import DialogUpgradePlan from './dialog-upgrade-plan'
import { DropdownEditPageLayout } from './dropdown-edit-page-layout'
import DropdownEditPageTheme from './dropdown-edit-page-theme'
import TimelineScroll from '../../../components/timeline-scroll'
import { WidgetsEditPanel } from './widgets-edit-panel'
import DialogMobileView from './dialog-mobile-view'
import DialogSharePage from './dialog-share-page'

export default async function CustomizePage() {
    const session = await auth()

    if (!session?.user) {
        redirect('/sign-in')
    }

    const user = await getUser(session.user.id)
    const subscription = await getSubscriptionByUserId(session.user.id)

    return (
        <>
            <div className="md:px-24 sm:pb-2 lg:px-60">
                <MenuItems hasSubscription={!!subscription} user={user} />
            </div>
            <div className="flex flex-col items-center py-3 px-3 md:px-24 lg:px-60">
                <ProfileSection>
                    <ProfileSectionContent>
                        <ProfileSectionImage>
                            <DialogEditProfileImage
                                imageUrl={user.imageUrl || undefined}
                            />
                        </ProfileSectionImage>
                        <ProfileSectionInfoContainer>
                            <DialogEditProfile
                                user={{
                                    bio: user.bio,
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
                                <DialogCreateSocialLink
                                    userLinks={user.socialLinks}
                                    key={link.id}
                                    socialLink={link}
                                />
                            ))}
                            {user.socialLinks.length < 6 && (
                                <DialogCreateSocialLink
                                    userLinks={user.socialLinks}
                                    key="add_social_link"
                                />
                            )}
                        </>
                    </ProfileSectionLinks>
                </ProfileSection>
                <div className="w-full">
                    {user.layout === 'list' ? (
                        <div>
                            {user.integrationTokens.length === 0 ? (
                                <span className="h-min rounded-md border p-4 text-center">
                                    No integrations. Click on Integrations to
                                    add a new
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
                <div className="sm:hidden fixed bottom-5 right-5">
                    <ButtonVisitPage
                        hasSubscription={!!subscription}
                        user={user}
                    />
                </div>
            </div>
        </>
    )
}

function MenuItems({
    hasSubscription,
    user,
}: {
    hasSubscription: boolean
    user: Omit<InferSelectModel<typeof users>, 'password'> & {
        integrationTokens: InferSelectModel<typeof integrationTokens>[]
    }
}) {
    return (
        <div className="mt-4 flex justify-center sm:justify-between">
            <div className="hidden sm:block">
                <ButtonVisitPage
                    hasSubscription={hasSubscription}
                    user={user}
                />
            </div>
            <div className="flex justify-end">
                {user.username && <DialogSharePage username={user.username} />}
                <div className="hidden sm:block">
                    <DialogMobileView />
                </div>
                <DropdownEditPageTheme />
                <DropdownEditPageLayout layout={user.layout} />
                <DialogEditIntegrations integrations={user.integrationTokens} />
                <ButtonSignOut />
            </div>
        </div>
    )
}

function ButtonVisitPage({
    hasSubscription,
    user,
}: {
    hasSubscription: boolean
    user: Omit<InferSelectModel<typeof users>, 'password'> & {
        integrationTokens: InferSelectModel<typeof integrationTokens>[]
    }
}) {
    return !hasSubscription ? (
        <DialogUpgradePlan />
    ) : user.username ? (
        <Button variant={'outline'} asChild>
            <Link target="_blank" href={'/' + user.username}>
                <SquareArrowRightIcon className="h-4 w-4 mr-1" />
                Visit your page
            </Link>
        </Button>
    ) : (
        <DialogEditProfile
            user={user}
            trigger={
                <Button variant={'outline'}>
                    <CircleCheckIcon className="h-4 w-4 mr-1" />
                    Claim username to deploy
                </Button>
            }
        />
    )
}
