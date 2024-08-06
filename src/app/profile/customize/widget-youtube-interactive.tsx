'use client'
import {
    Widget,
    WidgetContent,
    WidgetHeader,
    WidgetOptions,
    WidgetTitle,
    YoutubeTitle
} from '@/components/widget'
import YoutubeScroll from '@/components/youtube-scroll'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useQuery } from '@tanstack/react-query'
import { youtube_v3 } from 'googleapis'
import { LoaderCircle } from 'lucide-react'
import PairAccountButton from './pair-account-button'

async function fetchYoutubeMediaFromApi(userId: string) {
    const res = await fetch('/api/youtube/media/' + userId)
    const data = await res.json()
    if (!res.ok) throw new Error(data.message)
    return data as {
        channel: youtube_v3.Schema$ChannelSnippet | null
        media: youtube_v3.Schema$Video[] | null
    } | null
}

export default function WidgetYoutubeInteractive({
    userId,
    widgetId,
    removeWidget,
}: {
    userId: string
    widgetId: string
    removeWidget: (id: string) => void
}) {
    const { data, isLoading, error, isError } = useQuery({
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
                    <YoutubeTitle channel={data?.channel} />
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
                    error.message === 'No access token' ? (
                        <PairAccountButton
                            label={'Click to connect your Youtube account'}
                            link={process.env.NEXT_PUBLIC_URL! + '/api/youtube'}
                        />
                    ) : (
                        <p>{error.message}</p>
                    )
                ) : data?.media ? (
                    <YoutubeScroll media={data.media} />
                ) : (
                    <p>An error occured.</p>
                )}
            </WidgetContent>
        </Widget>
    )
}
