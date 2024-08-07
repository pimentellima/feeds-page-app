import WidgetScrollPinterest from '@/components/widget-scroll-pinterest'
import {
    WidgetTitlePinterest,
    Widget,
    WidgetContent,
    WidgetHeader,
    WidgetTitle,
} from '@/components/widget'
import {
    fetchPinterestUserMedia,
    fetchPinterestUserProfile,
} from '@/lib/api-helpers/pinterest'
import { getPinterestAccessToken } from '@/services/integration-tokens'

async function getMedia(accessToken: string) {
    try {
        const media = await fetchPinterestUserMedia(accessToken)
        const profile = await fetchPinterestUserProfile(accessToken)

        return {
            profile,
            media,
        }
    } catch {
        return null
    }
}

export async function WidgetPinterest({ userId }: { userId: string }) {
    const accessToken = await getPinterestAccessToken(userId)
    if (!accessToken) return null

    const media = await getMedia(accessToken)
    if (!media?.media) return null

    return (
        <Widget>
            <WidgetHeader>
                <WidgetTitle>
                    <WidgetTitlePinterest profile={media.profile} />
                </WidgetTitle>
            </WidgetHeader>
            <WidgetContent>
                <WidgetScrollPinterest media={media.media} />
            </WidgetContent>
        </Widget>
    )
}
