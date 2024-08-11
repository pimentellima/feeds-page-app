import {
    Widget,
    WidgetContent,
    WidgetHeader,
    WidgetTitle,
    WidgetTitleTiktok,
} from '@/components/widget'
import WidgetScrollTiktok from '@/components/widget-scroll-tiktok'
import getUserTiktokData from '@/lib/get-user-tiktok-data'

export async function WidgetTiktok({ userId }: { userId: string }) {
    const media = await getUserTiktokData(userId).catch(() => null)
    if (!media) return null
    return (
        <Widget>
            <WidgetHeader>
                <WidgetTitle>
                    <WidgetTitleTiktok user={media?.user} />
                </WidgetTitle>
            </WidgetHeader>
            <WidgetContent>
                <WidgetScrollTiktok media={media.media} />
            </WidgetContent>
        </Widget>
    )
}
