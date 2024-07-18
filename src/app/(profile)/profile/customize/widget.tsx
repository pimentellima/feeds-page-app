import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ReactNode } from 'react'
import DeleteWidgetPopover from './delete-widget-popover'

export default function Widget({
    content,
    header,
    widgetId,
}: {
    content?: ReactNode
    header: ReactNode
    widgetId: string
}) {
    return (
        <Card className="text-sm">
            <CardHeader className="grid grid-cols-3">
                <div className="col-start-2 flex flex-col gap-1 items-center justify-center">
                    {header}
                </div>
                <div className="justify-self-end">
                    <DeleteWidgetPopover id={widgetId} />
                </div>
            </CardHeader>
            {content && (
                <CardContent className="flex justify-center">
                    {content}
                </CardContent>
            )}
        </Card>
    )
}
