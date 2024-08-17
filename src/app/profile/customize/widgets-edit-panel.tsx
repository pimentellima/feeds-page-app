'use client'
import { SocialLinkIcon } from '@/components/social-icons'
import SpotifyIcon from '@/components/spotify-icon'
import TiktokIcon from '@/components/tiktok-icon'
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
    Widget,
    WidgetContent,
    WidgetHeader,
    WidgetOptions,
    WidgetTitle,
} from '@/components/widget'
import XTwitterIcon from '@/components/xtwitter-icon'
import { widgets } from '@/drizzle/schema'
import { moveItem } from '@/lib/utils'
import {
    closestCenter,
    DndContext,
    DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import {
    FacebookIcon,
    InstagramIcon,
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
import WidgetInstagramEdit from './widget-instagram-edit'
import WidgetPinterestEdit from './widget-pinterest-edit'
import WidgetSpotifyEdit from './widget-spotify-edit'
import WidgetTiktokEdit from './widget-tiktok-edit'
import WidgetYoutubeEdit from './widget-youtube-edit'
import TwitchIcon from '@/components/twitch-icon'
import WidgetTwitchEdit from './widget-twitch-edit'

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

export function WidgetsEditPanel({
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
                            <WidgetInstagramEdit
                                key={widget.id}
                                removeWidget={removeWidget}
                                userId={userId}
                                widgetId={widget.id}
                            />
                        )
                    if (widget.type === 'tiktokIntegration')
                        return (
                            <WidgetTiktokEdit
                                key={widget.id}
                                removeWidget={removeWidget}
                                userId={userId}
                                widgetId={widget.id}
                            />
                        )
                    if (widget.type === 'youtubeIntegration')
                        return (
                            <WidgetYoutubeEdit
                                key={widget.id}
                                removeWidget={removeWidget}
                                userId={userId}
                                widgetId={widget.id}
                            />
                        )
                    if (widget.type === 'spotifyIntegration')
                        return (
                            <WidgetSpotifyEdit
                                key={widget.id}
                                removeWidget={removeWidget}
                                userId={userId}
                                widgetId={widget.id}
                            />
                        )
                    if (widget.type === 'pinterestIntegration')
                        return (
                            <WidgetPinterestEdit
                                key={widget.id}
                                removeWidget={removeWidget}
                                userId={userId}
                                widgetId={widget.id}
                            />
                        )
                    if (widget.type === 'twitchIntegration')
                        return (
                            <WidgetTwitchEdit
                                key={widget.id}
                                removeWidget={removeWidget}
                                userId={userId}
                                widgetId={widget.id}
                            />
                        )
                    if (!widget.type)
                        return (
                            <WidgetSelectType
                                key={widget.id}
                                onClickDelete={() => removeWidget(widget.id)}
                                onClickUpdateType={(type) =>
                                    updateWidgetType(widget.id, type)
                                }
                            />
                        )
                })}
            </SortableContext>
            <ButtonAddWidget onClickAddWidget={addNewWidget} />
        </DndContext>
    )
}

function ButtonAddWidget({
    onClickAddWidget,
}: {
    onClickAddWidget: () => void
}) {
    return (
        <Button
            onClick={onClickAddWidget}
            className="text-sm h-[450px] hover:bg-card/70 bg-card text-card-foreground transition-colors space-y-4"
        >
            <div className="h-full w-full flex justify-center items-center flex-col">
                <PlusIcon className="h-14 w-14" />
                Add widget
            </div>
        </Button>
    )
}

function WidgetSelectType({
    onClickUpdateType,
    onClickDelete,
}: {
    onClickUpdateType: (type: InferInsertModel<typeof widgets>['type']) => void
    onClickDelete: () => void
}) {
    return (
        <Widget>
            <WidgetHeader>
                <WidgetTitle>New widget</WidgetTitle>
                <WidgetOptions onClickDelete={onClickDelete} />
            </WidgetHeader>
            <WidgetContent>
                <Select
                    onValueChange={(type) =>
                        onClickUpdateType(
                            type as InferInsertModel<typeof widgets>['type']
                        )
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
                            <SelectItem value="pinterestIntegration">
                                <div className="flex items-center">
                                    <SocialLinkIcon
                                        linkType="pinterest"
                                        className="mr-1 w-4 h-4"
                                    />
                                    Pinterest posts
                                </div>
                            </SelectItem>
                            <SelectItem value="youtubeIntegration">
                                <div className="flex items-center">
                                    <YoutubeIcon className="mr-1 text-red-500 w-4 h-4" />
                                    Youtube videos
                                </div>
                            </SelectItem>
                            <SelectItem value="instagramIntegration">
                                <div className="flex items-center">
                                    <InstagramIcon className="mr-1 text-pink-400 w-4 h-4" />
                                    Instagram media
                                </div>
                            </SelectItem>
                            <SelectItem value="twitchIntegration">
                                <div className="flex items-center">
                                    <TwitchIcon className="mr-1 fill-purple-600 w-4 h-4" />
                                    Twitch stream videos
                                </div>
                            </SelectItem>
                            <SelectItem disabled value="spotifyIntegration">
                                <div className="flex items-center">
                                    <SpotifyIcon className="mr-1 text-white fill-green-800 w-4 h-4" />
                                    Spotify recently played (soon)
                                </div>
                            </SelectItem>
                            <SelectItem disabled value="facebook">
                                <div className="flex items-center">
                                    <FacebookIcon className="mr-1 text-blue-500 w-4 h-4" />
                                    Facebook posts (soon)
                                </div>
                            </SelectItem>
                            <SelectItem disabled value="xIntegration">
                                <div className="flex items-center">
                                    <XTwitterIcon className="mr-1 fill-foreground w-4 h-4" />
                                    X posts (soon)
                                </div>
                            </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </WidgetContent>
        </Widget>
    )
}
