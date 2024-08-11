'use client'
import {
    Widget,
    WidgetContent,
    WidgetHeader,
    WidgetOptions,
    WidgetTitle,
    WidgetTitlePinterest,
} from '@/components/widget'
import WidgetScrollPinterest from '@/components/widget-scroll-pinterest'
import { PinterestMedia, PinterestProfile } from '@/types/pinterest'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useQuery } from '@tanstack/react-query'
import { LoaderCircle } from 'lucide-react'
import ButtonConnectAccount from './button-connect-account'

async function fetchPinterestMediaFromApi(userId: string): Promise<{
    media: PinterestMedia[]
    profile: PinterestProfile
}> {
    const res = await fetch('/api/pinterest/media/' + userId)
    const data = await res.json()
    if (!res.ok) throw new Error(data.message)
    return data
}

export default function WidgetPinterestEdit({
    userId,
    widgetId,
    removeWidget,
}: {
    userId: string
    widgetId: string
    removeWidget: (id: string) => void
}) {
    const { data, isLoading, isError, error } = useQuery({
        queryFn: () => fetchPinterestMediaFromApi(userId),
        queryKey: ['pinterestMedia', userId],
        refetchOnWindowFocus: false,
    })

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: widgetId })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <Widget ref={setNodeRef} style={style}>
            <WidgetHeader>
                <WidgetTitle>
                    <WidgetTitlePinterest profile={data?.profile} />
                </WidgetTitle>
                <WidgetOptions
                    isDragging={isDragging}
                    attributes={attributes}
                    listeners={listeners}
                    onClickDelete={() => removeWidget(widgetId)}
                />
            </WidgetHeader>
            <WidgetContent>
                {isLoading ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : isError ? (
                    error?.message === 'No access token' ? (
                        <ButtonConnectAccount
                            label={'Click to connect your Pinterest account'}
                            url={
                                process.env.NEXT_PUBLIC_URL! + '/api/pinterest'
                            }
                        />
                    ) : error?.message === 'Invalid access token' ? (
                        <div className="flex flex-col items-center gap-1">
                            <p>Your account has been disconneted.</p>
                            <ButtonConnectAccount
                                label={'Reconnect'}
                                url={
                                    process.env.NEXT_PUBLIC_URL! +
                                    '/api/pinterest'
                                }
                            />
                        </div>
                    ) : (
                        <p>An error occurred fetching data.</p>
                    )
                ) : data ? (
                    <WidgetScrollPinterest media={data.media} />
                ) : null}
            </WidgetContent>
        </Widget>
    )
}
