import {
    Widget,
    WidgetContent,
    WidgetHeader,
    WidgetTitle,
    WidgetTitlePinterest,
} from '@/components/widget'
import WidgetScrollPinterest from '@/components/widget-scroll-pinterest'
import getUserPinterestData from '@/lib/get-user-pinterest-data'

export async function WidgetPinterest({ userId }: { userId: string }) {
    const media = await getUserPinterestData(userId).catch(() => null)
    if (!media) return null
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
