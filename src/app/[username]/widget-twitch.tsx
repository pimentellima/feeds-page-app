import {
    Widget,
    WidgetContent,
    WidgetHeader,
    WidgetTitle,
    WidgetTitleTwitch
} from '@/components/widget'
import WidgetScrollTwitch from '@/components/widget-scroll-twitch'
import getUserTwitchData from '@/lib/get-user-twitch-data'

export async function WidgetTwitch({ userId }: { userId: string }) {
    const media = await getUserTwitchData(userId).catch(() => null)
    if (!media) return null

    return (
        <Widget>
            <WidgetHeader>
                <WidgetTitle>
                    <WidgetTitleTwitch user={media.user} />
                </WidgetTitle>
            </WidgetHeader>
            <WidgetContent>
                <WidgetScrollTwitch media={media.media} />
            </WidgetContent>
        </Widget>
    )
}
