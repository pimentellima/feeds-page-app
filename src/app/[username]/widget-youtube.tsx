import {
    Widget,
    WidgetContent,
    WidgetHeader,
    WidgetTitle,
    WidgetTitleYoutube,
} from '@/components/widget'
import WidgetScrollYoutube from '@/components/widget-scroll-youtube'
import getUserYoutubeData from '@/lib/get-user-youtube-data'

export async function WidgetYoutube({ userId }: { userId: string }) {
    const media = await getUserYoutubeData(userId).catch(() => null)
    if (!media) return null

    return (
        <Widget>
            <WidgetHeader>
                <WidgetTitle>
                    <WidgetTitleYoutube channel={media.channel} />
                </WidgetTitle>
            </WidgetHeader>
            <WidgetContent>
                <WidgetScrollYoutube media={media.media} />
            </WidgetContent>
        </Widget>
    )
}
