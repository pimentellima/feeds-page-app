import WidgetScrollInstagram from '@/components/widget-scroll-instagram'
import {
    WidgetTitleInstagram,
    Widget,
    WidgetContent,
    WidgetHeader,
    WidgetTitle,
} from '@/components/widget'
import {
    fetchInstagramMedia,
    fetchInstagramProfile,
} from '@/lib/api-helpers/instagram'
import { getInstagramAccessToken } from '@/services/integration-tokens'

async function getMedia(accessToken: string) {
    try {
        const media = await fetchInstagramMedia(accessToken)
        const profile = await fetchInstagramProfile(accessToken)

        return {
            profile,
            media,
        }
    } catch {
        return null
    }
}

export async function WidgetInstagram({ userId }: { userId: string }) {
    const accessToken = await getInstagramAccessToken(userId)
    if (!accessToken) return null

    const media = await getMedia(accessToken)
    if (!media?.media) return null

    return (
        <Widget>
            <WidgetHeader>
                <WidgetTitle>
                    <WidgetTitleInstagram profile={media?.profile} />
                </WidgetTitle>
            </WidgetHeader>
            <WidgetContent>
                <WidgetScrollInstagram media={media.media} />
            </WidgetContent>
        </Widget>
    )
}
