'use client'
import { InstagramPost, InstagramProfile } from '@/lib/api-helpers/instagram'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useQuery } from '@tanstack/react-query'
import {
    InstagramTitle,
    Widget,
    WidgetContent,
    WidgetHeader,
    WidgetOptions,
    WidgetTitle,
} from '@/components/widget'
import PairAccountButton from './pair-account-button'
import { LoaderCircle } from 'lucide-react'
import InstagramScroll from '@/components/instagram-scroll'

async function fetchInstagramMediaFromApi(userId: string) {
    const res = await fetch('/api/ig/media/' + userId)
    const data = await res.json()
    if (!res.ok) throw new Error(data.message)
    return data as {
        profile: InstagramProfile
        media: InstagramPost[]
    } | null
}

export default function WidgetInstagramInteractive({
    userId,
    widgetId,
    removeWidget,
}: {
    userId: string
    widgetId: string
    removeWidget: (id: string) => void
}) {
    const { data, isLoading, error, isError } = useQuery({
        queryFn: () => fetchInstagramMediaFromApi(userId),
        queryKey: ['instagramMedia', userId],
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
                    <InstagramTitle profile={data?.profile} />
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
                            label={'Click to connect your Instagram account'}
                            link={process.env.NEXT_PUBLIC_URL! + '/api/ig'}
                        />
                    ) : (
                        <p>{error.message}</p>
                    )
                ) : data?.media ? (
                    <InstagramScroll media={data.media} />
                ) : (
                    <p>An error occured.</p>
                )}
            </WidgetContent>
        </Widget>
    )
}
