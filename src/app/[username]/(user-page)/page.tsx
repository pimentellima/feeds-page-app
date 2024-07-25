import { SocialLinkIcon } from '@/app/(profile)/profile/customize/social-icons'
import InstagramScroll from '@/components/instagram-scroll'
import {
    ProfileSection,
    ProfileSectionContent,
    ProfileSectionFooter,
    ProfileSectionImage,
    ProfileSectionInfo,
    ProfileSectionInfoContainer,
    ProfileSectionLinks,
} from '@/components/profile-section'
import SpotifyScroll from '@/components/spotify-scroll'
import TiktokScroll from '@/components/tiktok-scroll'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import UserAvatar from '@/components/user-avatar'
import {
    InstagramTitle,
    SpotifyTitle,
    TiktokTitle,
    Widget,
    WidgetContent,
    WidgetGrid,
    WidgetHeader,
    WidgetTitle,
    YoutubeTitle,
} from '@/components/widget'
import YoutubeScroll from '@/components/youtube-scroll'
import {
    fetchInstagramMedia,
    fetchInstagramProfile,
} from '@/lib/api-helpers/instagram'
import {
    fetchSpotifyMedia,
    fetchSpotifyProfile,
} from '@/lib/api-helpers/spotify'
import { fetchTiktokMedia, fetchTiktokUser } from '@/lib/api-helpers/tiktok'
import {
    fetchYoutubeChannel,
    fetchYoutubeMedia,
} from '@/lib/api-helpers/youtube'
import {
    getInstagramAccessToken,
    getSpotifyAccessToken,
    getTiktokAccessToken,
    getYoutubeAccessToken,
} from '@/services/integration-tokens'
import { getUserByUsername } from '@/services/user'
import { SquareArrowRightIcon } from 'lucide-react'
import Link from 'next/link'

export default async function UserPage({
    params,
}: {
    params: { username: string }
}) {
    const user = await getUserByUsername(params.username)

    return (
        <>
            <div className="hidden absolute top-5 right-14 sm:flex items-center gap-1">
                <Button asChild variant={'link'}>
                    <Link href={'/sign-in'}>Sign in</Link>
                </Button>
                <Button asChild variant={'link'}>
                    <Link href={'/sign-up'}>Create account</Link>
                </Button>
            </div>
            <div
                className="sm:grid sm:grid-cols-[4fr,10fr] sm:gap-44 sm:min-h-screen bg-background
                    flex flex-col px-6 sm:px-0"
            >
                <div className="sm:fixed sm:top-0 mt-2 sm:mt-20 sm:h-[80vh]">
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
                                            className="sm:h-6 sm:w-6 h-5 w-5"
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
                <div className="sm:hidden">
                    <Separator className="my-2" />
                </div>
                <WidgetGrid gridSize={user.gridSize ?? 2}>
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
                    })}
                </WidgetGrid>
            </div>
        </>
    )
}

async function TiktokWidget({ userId }: { userId: string }) {
    const accessToken = await getTiktokAccessToken(userId)
    if (!accessToken) return null

    const user = await fetchTiktokUser(accessToken)
    const media = await fetchTiktokMedia(accessToken)
    if (!media) return null

    return (
        <Widget>
            <WidgetHeader>
                <WidgetTitle>
                    <TiktokTitle user={user} />
                </WidgetTitle>
            </WidgetHeader>
            <WidgetContent>
                <TiktokScroll media={media} />
            </WidgetContent>
        </Widget>
    )
}

async function InstagramWidget({ userId }: { userId: string }) {
    const accessToken = await getInstagramAccessToken(userId)
    if (!accessToken) return null

    const profile = await fetchInstagramProfile(accessToken)
    const media = await fetchInstagramMedia(accessToken)
    if (!media) return null

    return (
        <Widget>
            <WidgetHeader>
                <WidgetTitle>
                    <InstagramTitle profile={profile} />
                </WidgetTitle>
            </WidgetHeader>
            <WidgetContent>
                <InstagramScroll media={media} />
            </WidgetContent>
        </Widget>
    )
}

async function YoutubeWidget({ userId }: { userId: string }) {
    const accessToken = await getYoutubeAccessToken(userId)
    if (!accessToken) return null

    const channel = await fetchYoutubeChannel(accessToken)
    const media = await fetchYoutubeMedia(accessToken)
    if (!media) return null

    return (
        <Widget>
            <WidgetHeader>
                <WidgetTitle>
                    <YoutubeTitle channel={channel} />
                </WidgetTitle>
            </WidgetHeader>
            <WidgetContent>
                <YoutubeScroll media={media} />
            </WidgetContent>
        </Widget>
    )
}

async function SpotifyWidget({ userId }: { userId: string }) {
    const accessToken = await getSpotifyAccessToken(userId)
    if (!accessToken) return null

    const profile = await fetchSpotifyProfile(accessToken)
    const media = await fetchSpotifyMedia(accessToken)
    if (!media) return null

    return (
        <Widget>
            <WidgetHeader>
                <WidgetTitle>
                    <SpotifyTitle profile={profile} />
                </WidgetTitle>
            </WidgetHeader>
            <WidgetContent>
                <SpotifyScroll media={media} />
            </WidgetContent>
        </Widget>
    )
}
