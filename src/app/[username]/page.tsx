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
import { WidgetInstagram } from './widget-instagram'
import { WidgetTiktok } from './widget-tiktok'
import { WidgetYoutube } from './widget-youtube'
import { WidgetSpotify } from './widget-spotify'
import { WidgetPinterest } from './widget-pinterest'
import { SocialLinkIcon } from '@/components/social-icons'
import { getSubscriptionByUserId } from '@/services/subscriptions'
import { redirect } from 'next/navigation'
import TimelineScroll from '../profile/customize/timeline-scroll'

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
        <div className="flex flex-col items-center gap-3 mt-3 px-3 md:px-24 lg:px-60">
            <ProfileSection>
                <ProfileSectionContent>
                    <ProfileSectionImage>
                        <UserAvatar imageUrl={user.imageUrl || undefined} />
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
            </ProfileSection>
            <div className="mt-3 w-full">
                {user.layout === 'list' ? (
                    <div
                        className="flex flex-col gap-4 col-start-2 lg:grid
                lg:gap-4 lg:mt-20 pb-10 lg:pr-16 pt-5 lg:pt-0 font-sans"
                    >
                        <TimelineScroll userId={user.id} />
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
                        {user.widgets.map((widget) => {
                            if (widget.type === 'instagramIntegration')
                                return (
                                    <WidgetInstagram
                                        key={widget.id}
                                        userId={user.id}
                                    />
                                )
                            if (widget.type === 'tiktokIntegration')
                                return (
                                    <WidgetTiktok
                                        key={widget.id}
                                        userId={user.id}
                                    />
                                )
                            if (widget.type === 'youtubeIntegration')
                                return (
                                    <WidgetYoutube
                                        key={widget.id}
                                        userId={user.id}
                                    />
                                )
                            if (widget.type === 'spotifyIntegration')
                                return (
                                    <WidgetSpotify
                                        key={widget.id}
                                        userId={user.id}
                                    />
                                )
                            if (widget.type === 'pinterestIntegration')
                                return (
                                    <WidgetPinterest
                                        key={widget.id}
                                        userId={user.id}
                                    />
                                )
                        })}
                    </WidgetGrid>
                )}
            </div>
            <Button className="mb-8" variant={'secondary'} size={'lg'} asChild>
                <Link href={'/sign-in'}>
                    <SquareArrowRightIcon className="h-4 w-4 mr-1" /> Create
                    your Feed Page
                </Link>
            </Button>
        </div>
    )
}
