'use client'
import PinterestScroll from '@/components/pinterest-scroll'
import {
    PinterestTitle,
    Widget,
    WidgetContent,
    WidgetHeader,
    WidgetOptions,
    WidgetTitle
} from '@/components/widget'
import { PinterestPin, PinterestProfile } from '@/lib/api-helpers/pinterest'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useQuery } from '@tanstack/react-query'
import { LoaderCircle } from 'lucide-react'
import PairAccountButton from './pair-account-button'

async function fetchPinterestMediaFromApi(userId: string) {
    const res = await fetch('/api/pinterest/media/' + userId)
    const data = await res.json()
    if (!res.ok) throw new Error(data.message)
    return data as {
        media: PinterestPin[] | null
        user: PinterestProfile | null
    } | null
}

export default function WidgetPinterestInteractive({
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
                    <PinterestTitle profile={data?.user} />
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
                            label={'Click to connect your Pinterest account'}
                            link={
                                process.env.NEXT_PUBLIC_URL! + '/api/pinterest'
                            }
                        />
                    ) : (
                        <p>{error.message}</p>
                    )
                ) : data?.media ? (
                    <PinterestScroll media={data.media} />
                ) : (
                    <p>An error occured.</p>
                )}
            </WidgetContent>
        </Widget>
    )
}
