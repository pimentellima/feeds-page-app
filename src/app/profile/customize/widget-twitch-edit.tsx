'use client'
import {
    Widget,
    WidgetContent,
    WidgetHeader,
    WidgetOptions,
    WidgetTitle,
    WidgetTitleTwitch,
} from '@/components/widget'
import { TwitchVideos, TwitchUser } from '@/types/twitch'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useQuery } from '@tanstack/react-query'
import ButtonConnectAccount from './button-connect-account'
import { LoaderCircle } from 'lucide-react'
import WidgetScrollTwitch from '@/components/widget-scroll-twitch'

async function fetchTwitchMediaFromApi(
    userId: string
): Promise<{ media: TwitchVideos[]; user: TwitchUser }> {
    const res = await fetch('/api/twitch/media/' + userId)
    const data = await res.json()
    if (!res.ok) throw new Error(data.message)
    return data
}

export default function WidgetTwitchEdit({
    userId,
    widgetId,
    removeWidget,
}: {
    userId: string
    widgetId: string
    removeWidget: (id: string) => void
}) {
    const { data, isLoading, isError, error } = useQuery({
        queryFn: () => fetchTwitchMediaFromApi(userId),
        queryKey: ['twitchMedia', userId],
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
                    <WidgetTitleTwitch user={data?.user} />
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
                            label={'Connect your Twitch account'}
                            url={process.env.NEXT_PUBLIC_URL! + '/api/twitch'}
                        />
                    ) : error?.message === 'Invalid access token' ? (
                        <div className="flex flex-col items-center gap-1">
                            <p>Your account has been disconnected.</p>
                            <ButtonConnectAccount
                                label={'Reconnect'}
                                url={
                                    process.env.NEXT_PUBLIC_URL! + '/api/twitch'
                                }
                            />
                        </div>
                    ) : (
                        <p>An error occurred fetching data.</p>
                    )
                ) : data ? (
                    <WidgetScrollTwitch media={data.media} />
                ) : null}
            </WidgetContent>
        </Widget>
    )
}
