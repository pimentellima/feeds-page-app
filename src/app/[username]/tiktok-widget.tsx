import TiktokScroll from '@/components/tiktok-scroll'
import {
    TiktokTitle,
    Widget,
    WidgetContent,
    WidgetHeader,
    WidgetTitle,
} from '@/components/widget'
import { fetchTiktokMedia, fetchTiktokUser } from '@/lib/api-helpers/tiktok'
import { getTiktokAccessToken } from '@/services/integration-tokens'

async function getMedia(accessToken: string) {
    try {
        const media = await fetchTiktokMedia(accessToken)
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

    return (
        <Widget>
            <WidgetHeader>
                <WidgetTitle>
                    <TiktokTitle user={media?.user} />
                </WidgetTitle>
            </WidgetHeader>
            <WidgetContent>
                {media?.media ? (
                    <TiktokScroll media={media.media} />
                ) : (
                    <p>An error occured fetching data.</p>
                )}
            </WidgetContent>
        </Widget>
    )
}
