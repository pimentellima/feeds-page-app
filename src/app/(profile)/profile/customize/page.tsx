import { Button } from '@/components/ui/button'
import { socialLinks, users } from '@/drizzle/schema'
import { auth } from '@/lib/auth'
import { getUser } from '@/services/user'
import { InferSelectModel } from 'drizzle-orm'
import { CircleCheckIcon, MapPinIcon, SquareArrowRightIcon } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { AccountSettingsDropdown } from './account-settings-dropdown'
import ChangeImageDialog from './change-image-dialog'
import ChangeThemeSelect from './change-theme-dropdown'
import { CustomizeWidgetsPanel } from './customize-widgets-panel'
import EditProfileDialog from './edit-profile-dialog'
import { SocialLinkDialog } from './social-link-dialog'
import {
    ProfileSection,
    ProfileSectionContent,
    ProfileSectionFooter,
    ProfileSectionImage,
    ProfileSectionInfo,
    ProfileSectionInfoContainer,
    ProfileSectionLinks,
} from '@/components/profile-section'

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
                <div className="fixed top-0 mt-20 h-[80vh]">
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
                            {user.username ? (
                                <Button variant={'secondary'} asChild>
                                    <Link target='_blank' href={'/' + user.username}>
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
                            )}{' '}
                        </ProfileSectionFooter>
                    </ProfileSection>
                </div>
                <div className="col-start-2 grid grid-cols-2 gap-4 pt-20 pb-10 pr-16">
                    <CustomizeWidgetsPanel
                        userId={user.id}
                        userWidgets={user.widgets}
                    />
                </div>
            </div>
        </>
    )
}
