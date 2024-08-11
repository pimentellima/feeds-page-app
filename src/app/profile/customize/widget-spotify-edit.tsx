'use client'
import {
    Widget,
    WidgetContent,
    WidgetHeader,
    WidgetOptions,
    WidgetTitle,
    WidgetTitleSpotify,
} from '@/components/widget'
import WidgetScrollSpotify from '@/components/widget-scroll-spotify'
import { SpotifyPlayedTrack, SpotifyProfile } from '@/types/spotify'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useQuery } from '@tanstack/react-query'
import { LoaderCircle } from 'lucide-react'
import ButtonConnectAccount from './button-connect-account'

async function fetchSpotifyMediaFromApi(
    userId: string
): Promise<{ media: SpotifyPlayedTrack[]; profile: SpotifyProfile }> {
    const res = await fetch('/api/spotify/media/' + userId)
    const data = await res.json()
    if (!res.ok) throw new Error(data.message)
    return data
}

export default function WidgetSpotifyEdit({
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
                    <WidgetTitleSpotify profile={data?.profile} />
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
                            label={'Connect your Spotify account'}
                            url={process.env.NEXT_PUBLIC_URL! + '/api/spotify'}
                        />
                    ) : error?.message === 'Invalid access token' ? (
                        <div className='flex flex-col items-center gap-1'>
                            <p>Your account has been disconnected.</p>
                            <ButtonConnectAccount
                                label={'Reconnect'}
                                url={
                                    process.env.NEXT_PUBLIC_URL! +
                                    '/api/spotify'
                                }
                            />
                        </div>
                    ) : (
                        <p>An error occurred fetching data.</p>
                    )
                ) : data ? (
                    <WidgetScrollSpotify media={data.media} />
                ) : null}
            </WidgetContent>
        </Widget>
    )
}
