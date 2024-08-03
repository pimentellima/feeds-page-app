import PinterestScroll from '@/components/pinterest-scroll'
import {
    PinterestTitle,
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

export async function PinterestWidget({ userId }: { userId: string }) {
    const accessToken = await getPinterestAccessToken(userId)
    if (!accessToken) return null

    const media = await getMedia(accessToken)
    if (!media) return null

    return (
        <Widget>
            <WidgetHeader>
                <WidgetTitle>
                    <PinterestTitle profile={media.profile} />
                </WidgetTitle>
            </WidgetHeader>
            <WidgetContent>
                {media?.media ? (
                    <PinterestScroll media={media.media} />
                ) : (
                    <p>An error occured fetching data.</p>
                )}
            </WidgetContent>
        </Widget>
    )
}
