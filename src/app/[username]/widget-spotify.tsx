import WidgetScrollSpotify from '@/components/widget-scroll-spotify'
import {
    WidgetTitleSpotify,
    Widget,
    WidgetContent,
    WidgetHeader,
    WidgetTitle,
} from '@/components/widget'
import {
    fetchSpotifyMedia,
    fetchSpotifyProfile,
} from '@/lib/api-helpers/spotify'
import { getSpotifyAccessToken } from '@/services/integration-tokens'

async function getMedia(accessToken: string) {
    try {
        const media = await fetchSpotifyMedia(accessToken)
        const profile = await fetchSpotifyProfile(accessToken)

        return {
            profile,
            media,
        }
    } catch {
        return null
    }
}

export async function WidgetSpotify({ userId }: { userId: string }) {
    const accessToken = await getSpotifyAccessToken(userId)
    if (!accessToken) return null

    const media = await getMedia(accessToken)
    if (!media?.media) return null

    return (
        <Widget>
            <WidgetHeader>
                <WidgetTitle>
                    <WidgetTitleSpotify profile={media.profile} />
                </WidgetTitle>
            </WidgetHeader>
            <WidgetContent>
                <WidgetScrollSpotify media={media.media} />
            </WidgetContent>
        </Widget>
    )
}
