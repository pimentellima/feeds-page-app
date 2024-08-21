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
import { getPinterestTokenState } from './has-tokens-actions'

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
    const { data: tokenState, isLoading: isLoadingToken } = useQuery({
        queryFn: () => getPinterestTokenState(userId),
        queryKey: ['pinterestToken', userId],
        refetchOnWindowFocus: false,
    })

    const { data, isLoading, isError, error } = useQuery({
        queryFn: () => fetchPinterestMediaFromApi(userId),
        queryKey: ['pinterestMedia', userId],
        refetchOnWindowFocus: false,
        enabled: tokenState === 'Valid token',
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
                {isLoading || isLoadingToken ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : data ? (
                    <WidgetScrollPinterest media={data.media} />
                ) : tokenState === 'Invalid access token' ? (
                    <div className="flex flex-col items-center gap-1">
                        <p>Your account has been disconnected.</p>
                        <ButtonConnectAccount
                            label={'Reconnect'}
                            url={
                                process.env.NEXT_PUBLIC_URL! + '/api/pinterest'
                            }
                        />
                    </div>
                ) : tokenState === 'No access token' ? (
                    <ButtonConnectAccount
                        label={'Connect your Pinterest account'}
                        url={process.env.NEXT_PUBLIC_URL! + '/api/pinterest'}
                    />
                ) : (
                    <p>An error occured.</p>
                )}
            </WidgetContent>
        </Widget>
    )
}
