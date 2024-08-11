'use client'
import {
    Widget,
    WidgetContent,
    WidgetHeader,
    WidgetOptions,
    WidgetTitle,
    WidgetTitleYoutube,
} from '@/components/widget'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useQuery } from '@tanstack/react-query'
import { LoaderCircle } from 'lucide-react'
import ButtonConnectAccount from './button-connect-account'
import WidgetScrollYoutube from '@/components/widget-scroll-youtube'
import { YoutubeChannel, YoutubeVideo } from '@/types/youtube'

async function fetchYoutubeMediaFromApi(userId: string): Promise<{
    channel: YoutubeChannel
    media: YoutubeVideo[]
}> {
    const res = await fetch('/api/youtube/media/' + userId)
    const data = await res.json()
    if (!res.ok) throw new Error(data.message)
    return data
}

export default function WidgetYoutubeEdit({
    userId,
    widgetId,
    removeWidget,
}: {
    userId: string
    widgetId: string
    removeWidget: (id: string) => void
}) {
    const { data, isLoading, error } = useQuery({
        queryFn: () => fetchYoutubeMediaFromApi(userId),
        queryKey: ['youtubeMedia', userId],
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
                    <WidgetTitleYoutube channel={data?.channel} />
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
                ) : error?.message === 'No access token' ? (
                    <ButtonConnectAccount
                        label={'Connect your Youtube account'}
                        url={process.env.NEXT_PUBLIC_URL! + '/api/youtube'}
                    />
                ) : error?.message === 'Invalid access token' ? (
                    <div className="flex flex-col items-center gap-1">
                        <p>Your account has been disconnected.</p>
                        <ButtonConnectAccount
                            label={'Reconnect'}
                            url={process.env.NEXT_PUBLIC_URL! + '/api/youtube'}
                        />
                    </div>
                ) : data ? (
                    <WidgetScrollYoutube media={data.media} />
                ) : null}
            </WidgetContent>
        </Widget>
    )
}
