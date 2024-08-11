import {
    Widget,
    WidgetContent,
    WidgetHeader,
    WidgetTitle,
    WidgetTitleInstagram,
} from '@/components/widget'
import WidgetScrollInstagram from '@/components/widget-scroll-instagram'
import getUserInstagramData from '@/lib/get-user-instagram-data'

export async function WidgetInstagram({ userId }: { userId: string }) {
    const media = await getUserInstagramData(userId).catch(() => null)
    if (!media) return null
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
