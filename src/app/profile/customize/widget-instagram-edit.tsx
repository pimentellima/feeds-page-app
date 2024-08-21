'use client'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useQuery } from '@tanstack/react-query'
import {
    WidgetTitleInstagram,
    Widget,
    WidgetContent,
    WidgetHeader,
    WidgetOptions,
    WidgetTitle,
} from '@/components/widget'
import ButtonConnectAccount from './button-connect-account'
import { LoaderCircle } from 'lucide-react'
import WidgetScrollInstagram from '@/components/widget-scroll-instagram'
import { InstagramMedia, InstagramProfile } from '@/types/instagram'
import { getInstagramTokenState } from './has-tokens-actions'

async function fetchInstagramMediaFromApi(userId: string): Promise<{
    profile: InstagramProfile
    media: InstagramMedia[]
}> {
    const res = await fetch('/api/ig/media/' + userId)
    const data = await res.json()
    if (!res.ok) throw new Error(data.message)
    return data
}

export default function WidgetInstagramEdit({
    userId,
    widgetId,
    removeWidget,
}: {
    userId: string
    widgetId: string
    removeWidget: (id: string) => void
}) {
    const { data: tokenState, isLoading: isLoadingToken } = useQuery({
        queryFn: () => getInstagramTokenState(userId),
        queryKey: ['instagramToken', userId],
        refetchOnWindowFocus: false,
    })

    const { data, isLoading, error, isError } = useQuery({
        queryFn: () => fetchInstagramMediaFromApi(userId),
        queryKey: ['instagramMedia', userId],
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
                    <WidgetTitleInstagram profile={data?.profile} />
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
                    <WidgetScrollInstagram media={data.media} />
                ) : tokenState === 'Invalid access token' ? (
                    <div className="flex flex-col items-center gap-1">
                        <p>Your account has been disconnected.</p>
                        <ButtonConnectAccount
                            label={'Reconnect'}
                            url={process.env.NEXT_PUBLIC_URL! + '/api/ig'}
                        />
                    </div>
                ) : tokenState === 'No access token' ? (
                    <ButtonConnectAccount
                        label={'Connect your Instagram account'}
                        url={process.env.NEXT_PUBLIC_URL! + '/api/ig'}
                    />
                ) : (
                    <p>An error occured.</p>
                )}
            </WidgetContent>
        </Widget>
    )
}
