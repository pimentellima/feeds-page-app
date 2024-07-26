'use client'
import { getInstagramMedia } from '@/app/actions/get-instagram-media'
import { getSpotifyMedia } from '@/app/actions/get-spotify-media'
import { getTiktokMedia } from '@/app/actions/get-tiktok-media'
import { getYoutubeMedia } from '@/app/actions/get-youtube-media'
import InstagramScroll from '@/components/instagram-scroll'
import SpotifyScroll from '@/components/spotify-scroll'
import TiktokIcon from '@/components/tiktok-icon'
import TiktokScroll from '@/components/tiktok-scroll'
import { Card } from '@/components/ui/card'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import {
    InstagramTitle,
    SpotifyTitle,
    TiktokTitle,
    Widget,
    WidgetContent,
    WidgetHeader,
    WidgetOptions,
    WidgetTitle,
    YoutubeTitle,
} from '@/components/widget'
import XTwitterIcon from '@/components/xtwitter-icon'
import YoutubeScroll from '@/components/youtube-scroll'
import { widgets } from '@/drizzle/schema'
import { InstagramPost, InstagramProfile } from '@/lib/api-helpers/instagram'
import { SpotifyMedia, SpotifyUserProfile } from '@/lib/api-helpers/spotify'
import { TiktokMedia, TiktokUser } from '@/lib/api-helpers/tiktok'
import {
    closestCenter,
    DndContext,
    DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core'
import {
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useQuery } from '@tanstack/react-query'
import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { youtube_v3 } from 'googleapis'
import {
    FacebookIcon,
    InstagramIcon,
    Loader,
    PlusIcon,
    YoutubeIcon,
} from 'lucide-react'
import { useOptimistic } from 'react'
import {
    createWidget,
    deleteWidget,
    setWidgetType,
    updateWidgetPosition,
} from './actions'
import PairAccountButton from './pair-account-button'
import SpotifyIcon from '@/components/spotify-icon'

type Widget = {
    id: string
    pos: number
    type?: InferSelectModel<typeof widgets>['type']
    action?: 'changeType' | 'delete' | 'create' | 'move'
}

interface CustomizeWidgetsPanelProps {
    userWidgets: InferSelectModel<typeof widgets>[]
    userId: string
}

export function CustomizeWidgetsPanel({
    userId,
    userWidgets,
}: CustomizeWidgetsPanelProps) {
    const { toast } = useToast()
    const [optimisticWidgets, addWidget] = useOptimistic<Widget[], Widget>(
        userWidgets,
        (state, newWidget) => {
            if (newWidget.action === 'delete') {
                const widgetIndex = state.findIndex(
                    (w) => w.id === newWidget.id
                )
                if (widgetIndex === -1) return state
                const newState = [...state]
                newState.splice(widgetIndex, 1)
                return newState
            }
            if (newWidget.action === 'changeType') {
                const oldWidgetIndex = state.findIndex(
                    (w) => w.id === newWidget.id
                )
                if (oldWidgetIndex === -1) return state
                const newState = [...state]
                newState.splice(oldWidgetIndex, 1, newWidget)
                return newState
            }
            if (newWidget.action === 'move') {
                const fromPos = state.find((w) => w.id === newWidget.id)?.pos
                if (!fromPos) return state
                const newState = moveItem(state, fromPos, newWidget.pos)
                if (!newState) return state
                return newState
            }
            return [...state, newWidget]
        }
    )

    const sortedWidgets = optimisticWidgets.sort((a, b) => a.pos - b.pos)

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const updateWidgetType = async (
        id: string,
        type: InferInsertModel<typeof widgets>['type']
    ) => {
        const oldWidget = optimisticWidgets.find((w) => w.id === id)
        if (!oldWidget) return
        addWidget({
            ...oldWidget,
            type,
            action: 'changeType',
        })
        const error = await setWidgetType(id, type)
        if (error) {
            toast({
                title: 'Error updating widget',
                variant: 'destructive',
            })
        }
    }

    const addNewWidget = async () => {
        const id = crypto.randomUUID()
        addWidget({
            id,
            pos: sortedWidgets.length
                ? sortedWidgets[sortedWidgets.length - 1].pos + 1
                : 1,
            action: 'create',
        })
        const error = await createWidget(id)
        if (error) {
            toast({
                title: 'Error adding widget',
                variant: 'destructive',
            })
        }
    }

    const removeWidget = async (id: string) => {
        addWidget({ id, action: 'delete', pos: -1 })
        const error = await deleteWidget(id)
        if (error) {
            toast({
                title: 'Error removing widget',
                variant: 'destructive',
            })
        }
    }

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event
        if (active.id !== over?.id) {
            const activeWidget = optimisticWidgets.find(
                (w) => w.id === active.id
            )
            const overWidget = optimisticWidgets.find((w) => w.id === over?.id)
            if (
                activeWidget?.pos === undefined ||
                overWidget?.pos === undefined
            ) {
                return
            }
            addWidget({
                action: 'move',
                id: activeWidget.id,
                pos: overWidget.pos,
            })
            await updateWidgetPosition(activeWidget.id, overWidget.pos)
        }
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext items={optimisticWidgets}>
                {sortedWidgets.map((widget) => {
                    if (widget.type === 'instagramIntegration')
                        return (
                            <InstagramWidget
                                key={widget.id}
                                removeWidget={removeWidget}
                                userId={userId}
                                widgetId={widget.id}
                            />
                        )
                    if (widget.type === 'tiktokIntegration')
                        return (
                            <TiktokWidget
                                key={widget.id}
                                removeWidget={removeWidget}
                                userId={userId}
                                widgetId={widget.id}
                            />
                        )
                    if (widget.type === 'youtubeIntegration')
                        return (
                            <YoutubeWidget
                                key={widget.id}
                                removeWidget={removeWidget}
                                userId={userId}
                                widgetId={widget.id}
                            />
                        )
                    if (widget.type === 'spotifyIntegration')
                        return (
                            <SpotifyWidget
                                key={widget.id}
                                removeWidget={removeWidget}
                                userId={userId}
                                widgetId={widget.id}
                            />
                        )
                    if (!widget.type)
                        return (
                            <Widget key={widget.id}>
                                <WidgetHeader>
                                    <WidgetTitle>New widget</WidgetTitle>
                                    <WidgetOptions
                                        onClickDelete={() =>
                                            removeWidget(widget.id)
                                        }
                                    />
                                </WidgetHeader>
                                <WidgetContent>
                                    <WidgetTypeSelect
                                        onSelectType={(type) =>
                                            updateWidgetType(widget.id, type)
                                        }
                                    />
                                </WidgetContent>
                            </Widget>
                        )
                })}
            </SortableContext>
            <Card
                onClick={addNewWidget}
                className="text-sm h-[450px] hover:bg-card/70 transition-colors space-y-4"
            >
                <button className="h-full w-full flex justify-center items-center flex-col">
                    <PlusIcon className="h-16 w-16" />
                    Add feed
                </button>
            </Card>
        </DndContext>
    )
}

function WidgetTypeSelect({
    onSelectType,
}: {
    onSelectType: (
        type: InferInsertModel<typeof widgets>['type']
    ) => Promise<void>
}) {
    return (
        <Select
            onValueChange={(value) =>
                onSelectType(value as InferInsertModel<typeof widgets>['type'])
            }
        >
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a feed type" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectItem value="tiktokIntegration">
                        <div className="flex items-center">
                            <TiktokIcon className="mr-1 fill-foreground w-4 h-4" />
                            Tiktok videos
                        </div>
                    </SelectItem>
                    <SelectItem value="instagramIntegration">
                        <div className="flex items-center">
                            <InstagramIcon className="mr-1 text-pink-400 w-4 h-4" />
                            Instagram media
                        </div>
                    </SelectItem>

                    <SelectItem value="youtubeIntegration">
                        <div className="flex items-center">
                            <YoutubeIcon className="mr-1 text-red-500 w-4 h-4" />
                            Youtube videos
                        </div>
                    </SelectItem>
                    <SelectItem value="spotifyIntegration">
                        <div className="flex items-center">
                            <SpotifyIcon className="mr-1 text-white fill-green-800 w-4 h-4" />
                            Spotify tracks
                        </div>
                    </SelectItem>
                    <SelectItem disabled value="facebook">
                        <div className="flex items-center">
                            <FacebookIcon className="mr-1 text-blue-500 w-4 h-4" />
                            Facebook posts
                        </div>
                    </SelectItem>
                    <SelectItem disabled value="xIntegration">
                        <div className="flex items-center">
                            <XTwitterIcon className="mr-1 fill-foreground w-4 h-4" />
                            X posts
                        </div>
                    </SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}

function InstagramWidget({
    userId,
    widgetId,
    removeWidget,
}: {
    userId: string
    widgetId: string
    removeWidget: (id: string) => void
}) {
    const { data, isLoading } = useQuery<{
        profile: InstagramProfile
        media: InstagramPost[]
    } | null>({
        queryFn: () => getInstagramMedia(userId),
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
                    <Loader className="h-4 w-4 animate-spin" />
                ) : data ? (
                    <InstagramScroll media={data?.media} />
                ) : (
                    <PairAccountButton
                        label={'Click to connect your Instagram account'}
                        link={process.env.NEXT_PUBLIC_URL! + '/api/ig'}
                    />
                )}
            </WidgetContent>
        </Widget>
    )
}

function TiktokWidget({
    userId,
    widgetId,
    removeWidget,
}: {
    userId: string
    widgetId: string
    removeWidget: (id: string) => void
}) {
    const { data, isLoading } = useQuery<{
        videos: TiktokMedia[]
        user: TiktokUser
    } | null>({
        queryFn: () => getTiktokMedia(userId),
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
                    <TiktokTitle user={data?.user} />
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
                    <Loader className="h-4 w-4 animate-spin" />
                ) : data ? (
                    <TiktokScroll media={data.videos} />
                ) : (
                    <PairAccountButton
                        label={'Click to connect your Tiktok account'}
                        link={process.env.NEXT_PUBLIC_URL! + '/api/tiktok'}
                    />
                )}
            </WidgetContent>
        </Widget>
    )
}

function YoutubeWidget({
    userId,
    widgetId,
    removeWidget,
}: {
    userId: string
    widgetId: string
    removeWidget: (id: string) => void
}) {
    const { data, isLoading } = useQuery<{
        channel: youtube_v3.Schema$ChannelSnippet | null
        media: youtube_v3.Schema$Video[] | null
    } | null>({
        queryFn: () => getYoutubeMedia(userId),
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
                    <Loader className="h-4 w-4 animate-spin" />
                ) : data?.media ? (
                    <YoutubeScroll media={data.media} />
                ) : (
                    <PairAccountButton
                        label={'Click to connect your Youtube account'}
                        link={process.env.NEXT_PUBLIC_URL! + '/api/youtube'}
                    />
                )}
            </WidgetContent>
        </Widget>
    )
}

function SpotifyWidget({
    userId,
    widgetId,
    removeWidget,
}: {
    userId: string
    widgetId: string
    removeWidget: (id: string) => void
}) {
    const { data, isLoading, isError } = useQuery<{
        media: SpotifyMedia[] | null
        profile: SpotifyUserProfile | null
    } | null>({
        queryFn: () => getSpotifyMedia(userId),
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
                {isError ? (
                    <p>An error occured fetching data.</p>
                ) : isLoading ? (
                    <Loader className="h-4 w-4 animate-spin" />
                ) : data?.media ? (
                    <SpotifyScroll media={data.media} />
                ) : (
                    <PairAccountButton
                        label={'Click to connect your Spotify account'}
                        link={process.env.NEXT_PUBLIC_URL! + '/api/spotify'}
                    />
                )}
            </WidgetContent>
        </Widget>
    )
}

function moveItem(widgets: Widget[], fromPos: number, toPos: number) {
    const updatedWidgets = [...widgets]

    const itemToMove = updatedWidgets.find((item) => item.pos === fromPos)

    if (!itemToMove) {
        return
    }

    const direction = toPos > fromPos ? 1 : -1

    updatedWidgets.forEach((item) => {
        if (direction === 1) {
            if (item.pos > fromPos && item.pos <= toPos) {
                item.pos -= 1
            }
        } else {
            if (item.pos < fromPos && item.pos >= toPos) {
                item.pos += 1
            }
        }
    })

    itemToMove.pos = toPos

    return updatedWidgets
}
