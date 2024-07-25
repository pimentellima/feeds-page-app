import TiktokScroll from '@/components/tiktok-scroll'
import {
    TiktokTitle,
    Widget,
    WidgetContent,
    WidgetHeader,
    WidgetTitle
} from '@/components/widget'
import { fetchTiktokMedia, fetchTiktokUser } from '@/lib/api-helpers/tiktok'
import { getTiktokAccessToken } from '@/services/integration-tokens'

async function getMedia(accessToken: string) {
    'use server'
    try {
        const media = await fetchTiktokMedia(accessToken)
        if (!media) return null
        const user = await fetchTiktokUser(accessToken)

        return {
            user,
            media,
        }
    } catch {
        return null
    }
}

export async function TiktokWidget({ userId }: { userId: string }) {
    const accessToken = await getTiktokAccessToken(userId)
    if (!accessToken) return null

    const media = await getMedia(accessToken)
    if (!media) return <p>An error occured fetching data.</p>

    return (
        <Widget>
            <WidgetHeader>
                <WidgetTitle>
                    <TiktokTitle user={media.user} />
                </WidgetTitle>
            </WidgetHeader>
            <WidgetContent>
                <TiktokScroll media={media.media} />
            </WidgetContent>
        </Widget>
    )
}
