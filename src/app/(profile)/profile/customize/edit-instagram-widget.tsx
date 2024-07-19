import InstagramWidget from '@/components/instagram-widget'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { integrationTokens } from '@/drizzle/schema'
import { refreshIntegrationAccessTokens } from '@/services/integration-tokens'
import { InferSelectModel } from 'drizzle-orm'
import { InstagramIcon } from 'lucide-react'
import DeleteWidgetPopover from './delete-widget-popover'
import PairAccountButton from './pair-account-button'

export default async function EditInstagramWidget({
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
                        <InstagramIcon className="text-pink-500 w-5 h-5" />
                        <p>Instagram Feed</p>
                    </div>
                    <div className="justify-self-end">
                        {widgetId && <DeleteWidgetPopover id={widgetId} />}
                    </div>
                </CardHeader>
                <CardContent className="flex justify-center">
                    <PairAccountButton
                        label="Click to pair your Instagram account."
                        link={process.env.NEXT_PUBLIC_URL! + '/api/ig'}
                    />
                </CardContent>
            </Card>
        )

    const accessToken =
        token.expiresAt && new Date() > token.expiresAt
            ? (
                  await refreshIntegrationAccessTokens(
                      token,
                      'instagramIntegration'
                  )
              )?.accessToken
            : token.accessToken

    if (!accessToken)
        return (
            <Card className="text-sm">
                <CardHeader className="grid grid-cols-3">
                    <div
                        className="col-start-2 justify-self-center 
                    flex flex-col items-center gap-1"
                    >
                        <InstagramIcon className="text-pink-500 w-5 h-5" />
                        <p>Instagram Feed</p>
                    </div>
                    <div className="justify-self-end">
                        {widgetId && <DeleteWidgetPopover id={widgetId} />}
                    </div>
                </CardHeader>
                <CardContent className="flex justify-center">
                    <PairAccountButton
                        label="Your Instagram account has been disconnected. Click to reconnect"
                        link={process.env.NEXT_PUBLIC_URL! + '/api/ig'}
                    />
                </CardContent>
            </Card>
        )

    return <InstagramWidget widgetId={widgetId} accessToken={accessToken} />
}
