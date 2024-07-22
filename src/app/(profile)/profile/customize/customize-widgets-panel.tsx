'use client'
import { getInstagramMedia } from '@/app/actions/get-instagram-media'
import { getTiktokMedia } from '@/app/actions/get-tiktok-media'
import InstagramScroll from '@/components/instagram-scroll'
import TiktokIcon from '@/components/tiktok-icon'
import TiktokScroll from '@/components/tiktok-scroll'
import { Button } from '@/components/ui/button'
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
    TiktokTitle,
    Widget,
    WidgetContent,
    WidgetHeader,
    WidgetOptions,
    WidgetTitle,
} from '@/components/widget'
import XTwitterIcon from '@/components/xtwitter-icon'
import { widgets } from '@/drizzle/schema'
import { InstagramPost, InstagramProfile } from '@/lib/api-helpers/instagram'
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
import {
    FacebookIcon,
    InstagramIcon,
    Loader,
    PlusIcon,
    YoutubeIcon
} from 'lucide-react'
import { useOptimistic } from 'react'
import {
    createWidget,
    deleteWidget,
    setWidgetType,
    updateWidgetPosition,
} from './actions'
import PairAccountButton from './pair-account-button'

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
                {sortedWidgets.map((widget) => (
                    <EditWidget
                        widget={widget}
                        deleteWidget={removeWidget}
                        updateWidgetType={updateWidgetType}
                        userId={userId}
                        key={widget.id}
                    />
                ))}
            </SortableContext>
            <Button
                onClick={addNewWidget}
                variant={'ghost'}
                className="flex justify-center items-center h-[450px] flex-col"
            >
                <PlusIcon className="h-16 w-16" />
                Add feed
            </Button>
        </DndContext>
    )
}

function EditWidget({
    widget,
    userId,
    updateWidgetType,
    deleteWidget,
}: {
    widget: Widget
    userId: string
    updateWidgetType: (
        id: string,
        type: InferInsertModel<typeof widgets>['type']
    ) => Promise<void>
    deleteWidget: (id: string) => Promise<void>
}) {
    const selectedFeed = widget.type

    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: widget.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <Widget ref={setNodeRef} style={style}>
            <WidgetHeader>
                <WidgetTitle>
                    {selectedFeed === 'tiktokIntegration' ? (
                        <TiktokWidgetTitle userId={userId} />
                    ) : selectedFeed === 'instagramIntegration' ? (
                        <InstagramWidgetTitle userId={userId} />
                    ) : (
                        'New widget'
                    )}
                </WidgetTitle>
                <WidgetOptions
                    attributes={attributes}
                    listeners={listeners}
                    onClickDelete={() => deleteWidget(widget.id)}
                />
            </WidgetHeader>
            <WidgetContent>
                {selectedFeed === 'tiktokIntegration' ? (
                    <TiktokWidgetFeed userId={userId} />
                ) : selectedFeed === 'instagramIntegration' ? (
                    <InstagramWidgetFeed userId={userId} />
                ) : (
                    <WidgetTypeSelect
                        onChangeType={(type) =>
                            updateWidgetType(widget.id, type)
                        }
                        widgetType={widget.type}
                    />
                )}
            </WidgetContent>
        </Widget>
    )
}

function WidgetTypeSelect({
    widgetType,
    onChangeType,
}: {
    widgetType: InferInsertModel<typeof widgets>['type']
    onChangeType: (
        type: InferInsertModel<typeof widgets>['type']
    ) => Promise<void>
}) {
    return (
        <Select
            value={widgetType || undefined}
            onValueChange={(value) =>
                onChangeType(value as InferInsertModel<typeof widgets>['type'])
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
                    <SelectItem disabled value="facebook">
                        <div className="flex items-center">
                            <FacebookIcon className="mr-1 text-blue-500 w-4 h-4" />
                            Facebook posts
                        </div>
                    </SelectItem>
                    <SelectItem disabled value="youtube">
                        <div className="flex items-center">
                            <YoutubeIcon className="mr-1 text-red-500 w-4 h-4" />
                            Youtube videos
                        </div>
                    </SelectItem>
                    <SelectItem disabled value="x">
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

function TiktokWidgetFeed({ userId }: { userId: string }) {
    const { data: media, isLoading } = useQuery<{
        videos: TiktokMedia[]
        user: TiktokUser
    } | null>({
        queryFn: () => getTiktokMedia(userId),
        queryKey: ['tiktokMedia', userId],
        refetchOnWindowFocus: false,
    })

    return isLoading ? (
        <Loader className="h-4 w-4 animate-spin" />
    ) : media ? (
        <TiktokScroll media={media.videos} />
    ) : (
        <PairAccountButton
            label={'Click to connect your Tiktok account'}
            link={process.env.NEXT_PUBLIC_URL! + '/api/tiktok'}
        />
    )
}

function TiktokWidgetTitle({ userId }: { userId: string }) {
    const { data: media } = useQuery<{
        videos: TiktokMedia[]
        user: TiktokUser
    } | null>({
        queryFn: () => getTiktokMedia(userId),
        queryKey: ['tiktokMedia', userId],
        refetchOnWindowFocus: false,
    })

    return <TiktokTitle user={media?.user} />
}

function InstagramWidgetFeed({ userId }: { userId: string }) {
    const { data: media, isLoading } = useQuery<{
        profile: InstagramProfile
        media: InstagramPost[]
    } | null>({
        queryFn: () => getInstagramMedia(userId),
        queryKey: ['instagramMedia', userId],
        refetchOnWindowFocus: false,
    })

    return isLoading ? (
        <Loader className="h-4 w-4 animate-spin" />
    ) : media ? (
        <InstagramScroll media={media.media} />
    ) : (
        <PairAccountButton
            label={'Click to connect your Instagram account'}
            link={process.env.NEXT_PUBLIC_URL! + '/api/ig'}
        />
    )
}

function InstagramWidgetTitle({ userId }: { userId: string }) {
    const { data: media } = useQuery<{
        profile: InstagramProfile
        media: InstagramPost[]
    } | null>({
        queryFn: () => getInstagramMedia(userId),
        queryKey: ['instagramMedia', userId],
        refetchOnWindowFocus: false,
    })

    return <InstagramTitle profile={media?.profile} />
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
