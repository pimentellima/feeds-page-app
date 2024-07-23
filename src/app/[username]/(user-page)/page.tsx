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
import TiktokScroll from '@/components/tiktok-scroll'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import UserAvatar from '@/components/user-avatar'
import {
    InstagramTitle,
    TiktokTitle,
    Widget,
    WidgetContent,
    WidgetGrid,
    WidgetHeader,
    WidgetTitle,
} from '@/components/widget'
import { widgets } from '@/drizzle/schema'
import {
    fetchInstagramMedia,
    fetchInstagramProfile,
} from '@/lib/api-helpers/instagram'
import { fetchTiktokMedia, fetchTiktokUser } from '@/lib/api-helpers/tiktok'
import { getUserIntegrationAccessToken } from '@/services/integration-tokens'
import { getUserByUsername } from '@/services/user'
import { InferSelectModel } from 'drizzle-orm'
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
                                        <SocialLinkIcon className="sm:h-6 sm:w-6 h-5 w-5" linkType={link.type} />
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
                    {user.widgets.map((widget) => (
                        <SocialWidget widget={widget} key={widget.id} />
                    ))}
                </WidgetGrid>
            </div>
        </>
    )
}

async function SocialWidget({
    widget,
}: {
    widget: InferSelectModel<typeof widgets>
}) {
    const widgetType = widget.type
    if (!widgetType) return null

    const accessToken = await getUserIntegrationAccessToken(widgetType)
    if (!accessToken) return null

    return (
        <Widget>
            <WidgetHeader>
                <WidgetTitle>
                    {widgetType === 'tiktokIntegration' ? (
                        <TiktokWidgetTitle accessToken={accessToken} />
                    ) : widgetType === 'instagramIntegration' ? (
                        <InstagramWidgetTitle acesssToken={accessToken} />
                    ) : null}
                </WidgetTitle>
            </WidgetHeader>
            <WidgetContent>
                {widgetType === 'tiktokIntegration' ? (
                    <TiktokWidgetFeed accessToken={accessToken} />
                ) : widgetType === 'instagramIntegration' ? (
                    <InstagramWidgetFeed accessToken={accessToken} />
                ) : null}
            </WidgetContent>
        </Widget>
    )
}

async function TiktokWidgetFeed({ accessToken }: { accessToken: string }) {
    const media = await fetchTiktokMedia(accessToken)

    return <TiktokScroll media={media} />
}

async function TiktokWidgetTitle({ accessToken }: { accessToken: string }) {
    const user = await fetchTiktokUser(accessToken)

    return <TiktokTitle user={user} />
}

async function InstagramWidgetFeed({ accessToken }: { accessToken: string }) {
    const media = await fetchInstagramMedia(accessToken)

    return <InstagramScroll media={media} />
}

async function InstagramWidgetTitle({ acesssToken }: { acesssToken: string }) {
    const profile = await fetchInstagramProfile(acesssToken)

    return <InstagramTitle profile={profile} />
}
