import TiktokIcon from '@/components/tiktok-icon'
import TiktokWidget from '@/components/tiktok-widget'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { integrationTokens } from '@/drizzle/schema'
import { refreshIntegrationAccessTokens } from '@/services/integration-tokens'
import { InferSelectModel } from 'drizzle-orm'
import DeleteWidgetPopover from './delete-widget-popover'
import PairAccountButton from './pair-account-button'

export default async function EditTiktokWidget({
    widgetId,
    token,
}: {
    widgetId: string
    token?: InferSelectModel<typeof integrationTokens> | null
}) {
    if (!token)
        return (
            <Card className="text-sm">
                <CardHeader className="grid grid-cols-3">
                    <div
                        className="col-start-2 justify-self-center 
                    flex flex-col items-center gap-1"
                    >
                        <TiktokIcon className="fill-foreground w-5 h-5" />
                        <p>Tiktok Feed</p>
                    </div>
                    <div className="justify-self-end">
                        {widgetId && <DeleteWidgetPopover id={widgetId} />}
                    </div>
                </CardHeader>
                <CardContent className="flex justify-center">
                    <PairAccountButton
                        label="Click to pair your TikTok account"
                        link={process.env.NEXT_PUBLIC_URL! + '/api/tiktok'}
                    />
                </CardContent>
            </Card>
        )

    const accessToken =
        token.expiresAt && new Date() > token.expiresAt
            ? (await refreshIntegrationAccessTokens(token, 'tiktokIntegration'))
                  ?.accessToken
            : token.accessToken

    if (!accessToken)
        return (
            <Card className="text-sm">
                <CardHeader className="grid grid-cols-3">
                    <div
                        className="col-start-2 justify-self-center 
                        flex flex-col items-center gap-1"
                    >
                        <TiktokIcon className="fill-foreground w-5 h-5" />
                        <p>Tiktok Feed</p>
                    </div>
                    <div className="justify-self-end">
                        {widgetId && <DeleteWidgetPopover id={widgetId} />}
                    </div>
                </CardHeader>
                <CardContent className="flex justify-center">
                    <PairAccountButton
                        label="Your TikTok account has been disconnected. Click to reconnect"
                        link={process.env.NEXT_PUBLIC_URL! + '/api/tiktok'}
                    />
                </CardContent>
            </Card>
        )

    return <TiktokWidget widgetId={widgetId} accessToken={token.accessToken} />
}
