import InstagramScroll from '@/components/instagram-scroll'
import {
    InstagramTitle,
    Widget,
    WidgetContent,
    WidgetHeader,
    WidgetTitle
} from '@/components/widget'
import {
    fetchInstagramMedia,
    fetchInstagramProfile,
} from '@/lib/api-helpers/instagram'
import { getInstagramAccessToken } from '@/services/integration-tokens'

async function getMedia(accessToken: string) {
    'use server'
    try {
        const media = await fetchInstagramMedia(accessToken)
        if (!media) return null
        const profile = await fetchInstagramProfile(accessToken)

        return {
            profile,
            media,
        }
    } catch {
        return null
    }
}

export async function InstagramWidget({ userId }: { userId: string }) {
    const accessToken = await getInstagramAccessToken(userId)
    if (!accessToken) return null

    const media = await getMedia(accessToken)
    if (!media) return <p>An error occured fetching data.</p>

    return (
        <Widget>
            <WidgetHeader>
                <WidgetTitle>
                    <InstagramTitle profile={media.profile} />
                </WidgetTitle>
            </WidgetHeader>
            <WidgetContent>
                <InstagramScroll media={media.media} />
            </WidgetContent>
        </Widget>
    )
}
