import SpotifyScroll from '@/components/spotify-scroll'
import {
    SpotifyTitle,
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
    'use server'
    try {
        const media = await fetchSpotifyMedia(accessToken)
        if (!media) return null
        const profile = await fetchSpotifyProfile(accessToken)

        return {
            profile,
            media,
        }
    } catch {
        return null
    }
}

export async function SpotifyWidget({ userId }: { userId: string }) {
    const accessToken = await getSpotifyAccessToken(userId)
    if (!accessToken) return null

    const media = await getMedia(accessToken)
    if (!media) return <p>An error occured fetching data.</p>

    return (
        <Widget>
            <WidgetHeader>
                <WidgetTitle>
                    <SpotifyTitle profile={media.profile} />
                </WidgetTitle>
            </WidgetHeader>
            <WidgetContent>
                <SpotifyScroll media={media.media} />
            </WidgetContent>
        </Widget>
    )
}
