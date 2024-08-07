import {
    Widget,
    WidgetContent,
    WidgetHeader,
    WidgetTitle,
    WidgetTitleYoutube,
} from '@/components/widget'
import WidgetScrollYoutube from '@/components/widget-scroll-youtube'
import {
    fetchYoutubeChannel,
    fetchYoutubeMedia,
} from '@/lib/api-helpers/youtube'
import { getYoutubeAccessToken } from '@/services/integration-tokens'

async function getMedia(accessToken: string) {
    try {
        const media = await fetchYoutubeMedia(accessToken)
        if (!media) return null
        const channel = await fetchYoutubeChannel(accessToken)

        return {
            channel,
            media,
        }
    } catch {
        return null
    }
}

export async function WidgetYoutube({ userId }: { userId: string }) {
    const accessToken = await getYoutubeAccessToken(userId)
    if (!accessToken) return null

    const media = await getMedia(accessToken)
    if (!media?.media) return null

    return (
        <Widget>
            <WidgetHeader>
                <WidgetTitle>
                    <WidgetTitleYoutube channel={media?.channel} />
                </WidgetTitle>
            </WidgetHeader>
            <WidgetContent>
                <WidgetScrollYoutube media={media.media} />
            </WidgetContent>
        </Widget>
    )
}
