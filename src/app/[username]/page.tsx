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
import { Separator } from '@/components/ui/separator'
import UserAvatar from '@/components/user-avatar'
import { WidgetGrid } from '@/components/widget'
import { getUserByUsername } from '@/services/user'
import { SquareArrowRightIcon } from 'lucide-react'
import Link from 'next/link'
import { InstagramWidget } from './instagram-widget'
import { TiktokWidget } from './tiktok-widget'
import { YoutubeWidget } from './youtube-widget'
import { SpotifyWidget } from './spotify-widget'
import { PinterestWidget } from './pinterest-widget'
import { SocialLinkIcon } from '@/components/social-icons'
import { getSubscriptionByUserId } from '@/services/subscriptions'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'

export const revalidate = 1200

export async function generateMetadata({
    params,
}: {
    params: { username: string }
}) {
    const user = await getUserByUsername(params.username)
    const name = user.name || user.username
    return {
        title: `${name} - Feeds`,
    }
}

export default async function UserPage({
    params,
}: {
    params: { username: string }
}) {
    const user = await getUserByUsername(params.username)
    const subscription = await getSubscriptionByUserId(user.id)

    if (!user || !subscription) {
        return redirect('/404')
    }

    return (
        <>
            <div className="hidden absolute top-5 right-14 lg:flex items-center gap-1">
                <Button asChild variant={'link'}>
                    <Link href={'/sign-in'}>Sign in</Link>
                </Button>
                <Button asChild variant={'link'}>
                    <Link href={'/sign-up'}>Create account</Link>
                </Button>
            </div>
            <div
                className="lg:grid lg:grid-cols-[4fr,10fr] lg:gap-44 lg:min-h-screen bg-background
                    flex flex-col px-6 lg:px-0"
            >
                <div className="lg:fixed lg:top-0 mt-2 lg:mt-20 lg:h-[80vh]">
                    <ProfileSection>
                        <ProfileSectionContent>
                            <ProfileSectionImage>
                                <UserAvatar
                                    imageUrl={user.imageUrl || undefined}
                                />
                            </ProfileSectionImage>
                            <ProfileSectionInfoContainer>
                                <ProfileSectionInfo user={user} />
                            </ProfileSectionInfoContainer>
                        </ProfileSectionContent>
                        <ProfileSectionLinks>
                            {user.socialLinks.map((link) => (
                                <Button key={link.id} variant={'ghost'} asChild>
                                    <Link href={link.url}>
                                        <SocialLinkIcon
                                            className="lg:h-6 lg:w-6 h-5 w-5"
                                            linkType={link.type}
                                        />
                                    </Link>
                                </Button>
                            ))}
                        </ProfileSectionLinks>
                        <ProfileSectionFooter>
                            <Button variant={'secondary'} asChild>
                                <Link href={'/sign-in'}>
                                    <SquareArrowRightIcon className="h-4 w-4 mr-1" />{' '}
                                    Create your Feed Page
                                </Link>
                            </Button>
                        </ProfileSectionFooter>
                    </ProfileSection>
                </div>
                <div className="lg:hidden">
                    <Separator className="my-2" />
                </div>
                <WidgetGrid
                    gridSize={
                        user.layout === 'grid1x1'
                            ? 1
                            : user.layout === 'grid3x3'
                            ? 3
                            : 2
                    }
                >
                    {user.widgets.map((widget) => {
                        if (widget.type === 'instagramIntegration')
                            return (
                                <InstagramWidget
                                    key={widget.id}
                                    userId={user.id}
                                />
                            )
                        if (widget.type === 'tiktokIntegration')
                            return (
                                <TiktokWidget
                                    key={widget.id}
                                    userId={user.id}
                                />
                            )
                        if (widget.type === 'youtubeIntegration')
                            return (
                                <YoutubeWidget
                                    key={widget.id}
                                    userId={user.id}
                                />
                            )
                        if (widget.type === 'spotifyIntegration')
                            return (
                                <SpotifyWidget
                                    key={widget.id}
                                    userId={user.id}
                                />
                            )
                        if (widget.type === 'pinterestIntegration')
                            return (
                                <PinterestWidget
                                    key={widget.id}
                                    userId={user.id}
                                />
                            )
                    })}
                </WidgetGrid>
            </div>
        </>
    )
}
