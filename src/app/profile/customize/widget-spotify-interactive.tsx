'use client'
import SpotifyScroll from '@/components/spotify-scroll'
import {
    SpotifyTitle,
    Widget,
    WidgetContent,
    WidgetHeader,
    WidgetOptions,
    WidgetTitle
} from '@/components/widget'
import { SpotifyMedia, SpotifyUserProfile } from '@/lib/api-helpers/spotify'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useQuery } from '@tanstack/react-query'
import { LoaderCircle } from 'lucide-react'
import PairAccountButton from './pair-account-button'

async function fetchSpotifyMediaFromApi(userId: string) {
    const res = await fetch('/api/spotify/media/' + userId)
    const data = await res.json()
    if (!res.ok) throw new Error(data.message)
    return data as {
        media: SpotifyMedia[] | null
        profile: SpotifyUserProfile | null
    } | null
}

export default function WidgetSpotifyInteractive({
    userId,
    widgetId,
    removeWidget,
}: {
    userId: string
    widgetId: string
    removeWidget: (id: string) => void
}) {
    const { data, isLoading, isError, error } = useQuery({
        queryFn: () => fetchSpotifyMediaFromApi(userId),
        queryKey: ['spotifyMedia', userId],
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
                    <SpotifyTitle profile={data?.profile} />
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
                            label={'Click to connect your Spotify account'}
                            link={process.env.NEXT_PUBLIC_URL! + '/api/spotify'}
                        />
                    ) : (
                        <p>{error.message}</p>
                    )
                ) : data?.media ? (
                    <SpotifyScroll media={data.media} />
                ) : (
                    <p>An error occured.</p>
                )}
            </WidgetContent>
        </Widget>
    )
}
