'use client'
import {
    Widget,
    WidgetContent,
    WidgetHeader,
    WidgetOptions,
    WidgetTitle,
    WidgetTitleTiktok,
} from '@/components/widget'
import WidgetScrollTiktok from '@/components/widget-scroll-tiktok'
import { TiktokMedia, TiktokUser } from '@/types/tiktok'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useQuery } from '@tanstack/react-query'
import { LoaderCircle } from 'lucide-react'
import ButtonConnectAccount from './button-connect-account'
import { getTiktokTokenState } from './has-tokens-actions'

async function fetchTiktokMediaFromApi(
    userId: string
): Promise<{ media: TiktokMedia[]; user: TiktokUser }> {
    const res = await fetch('/api/tiktok/media/' + userId)
    const data = await res.json()
    if (!res.ok) throw new Error(data.message)
    return data
}

export default function WidgetTiktokEdit({
    userId,
    widgetId,
    removeWidget,
}: {
    userId: string
    widgetId: string
    removeWidget: (id: string) => void
}) {
    const { data: tokenState, isLoading: isLoadingToken } = useQuery({
        queryFn: () => getTiktokTokenState(userId),
        queryKey: ['tiktokToken', userId],
        refetchOnWindowFocus: false,
    })

    const { data, isLoading, isError, error } = useQuery({
        queryFn: () => fetchTiktokMediaFromApi(userId),
        queryKey: ['tiktokMedia', userId],
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
                    <WidgetTitleTiktok user={data?.user} />
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
                    <WidgetScrollTiktok media={data.media} />
                ) : tokenState === 'Invalid access token' ? (
                    <div className="flex flex-col items-center gap-1">
                        <p>Your account has been disconnected.</p>
                        <ButtonConnectAccount
                            label={'Reconnect'}
                            url={process.env.NEXT_PUBLIC_URL! + '/api/tiktok'}
                        />
                    </div>
                ) : tokenState === 'No access token' ? (
                    <ButtonConnectAccount
                        label={'Connect your Tiktok account'}
                        url={process.env.NEXT_PUBLIC_URL! + '/api/tiktok'}
                    />
                ) : (
                    <p>An error occured.</p>
                )}
            </WidgetContent>
        </Widget>
    )
}
