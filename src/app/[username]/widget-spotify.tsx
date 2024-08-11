import {
    Widget,
    WidgetContent,
    WidgetHeader,
    WidgetTitle,
    WidgetTitleSpotify,
} from '@/components/widget'
import WidgetScrollSpotify from '@/components/widget-scroll-spotify'
import getUserSpotifyData from '@/lib/get-user-spotify-data'


export async function WidgetSpotify({ userId }: { userId: string }) {
    const media = await getUserSpotifyData(userId).catch(() => null)
    if (!media) return null
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
