import {
    Widget,
    WidgetContent,
    WidgetHeader,
    WidgetTitle,
    YoutubeTitle
} from '@/components/widget'
import YoutubeScroll from '@/components/youtube-scroll'
import {
    fetchYoutubeChannel,
    fetchYoutubeMedia,
} from '@/lib/api-helpers/youtube'
import { getYoutubeAccessToken } from '@/services/integration-tokens'

async function getMedia(accessToken: string) {
    'use server'
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

export async function YoutubeWidget({ userId }: { userId: string }) {
    const accessToken = await getYoutubeAccessToken(userId)
    if (!accessToken) return null

    const media = await getMedia(accessToken)
    if (!media) return <p>An error occured fetching data.</p>

    return (
        <Widget>
            <WidgetHeader>
                <WidgetTitle>
                    <YoutubeTitle channel={media.channel} />
                </WidgetTitle>
            </WidgetHeader>
            <WidgetContent>
                <YoutubeScroll media={media.media} />
            </WidgetContent>
        </Widget>
    )
}
