'use client'
import WidgetScrollTiktok from '@/components/widget-scroll-tiktok'
import {
    WidgetTitleTiktok,
    Widget,
    WidgetContent,
    WidgetHeader,
    WidgetOptions,
    WidgetTitle,
} from '@/components/widget'
import { TiktokMedia, TiktokUser } from '@/lib/api-helpers/tiktok'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useQuery } from '@tanstack/react-query'
import { LoaderCircle } from 'lucide-react'
import ButtonConnectAccount from './button-connect-account'

async function fetchTiktokMediaFromApi(userId: string) {
    const res = await fetch('/api/tiktok/media/' + userId)
    const data = await res.json()
    if (!res.ok) throw new Error(data.message)
    return data as {
        videos: TiktokMedia[]
        user: TiktokUser
    } | null
}

export default function WidgetTiktokInteractive({
    userId,
    widgetId,
    removeWidget,
}: {
    userId: string
    widgetId: string
    removeWidget: (id: string) => void
}) {
    const { data, isLoading, isError, error } = useQuery({
        queryFn: () => fetchTiktokMediaFromApi(userId),
        queryKey: ['tiktokMedia', userId],
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
                {isLoading ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : isError ? (
                    error.message === 'No access token' ? (
                        <ButtonConnectAccount
                            label={'Click to connect your Tiktok account'}
                            url={process.env.NEXT_PUBLIC_URL! + '/api/tiktok'}
                        />
                    ) : (
                        <p>An error occured fetching data.</p>
                    )
                ) : data?.videos ? (
                    <WidgetScrollTiktok media={data.videos} />
                ) : (
                    <p>An error occured fetching data.</p>
                )}
            </WidgetContent>
        </Widget>
    )
}
