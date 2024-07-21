'use client'
import { getInstagramMedia } from '@/app/actions/get-instagram-media'
import { getTiktokMedia } from '@/app/actions/get-tiktok-media'
import InstagramMediaScroll from '@/components/instagram-feed'
import TiktokIcon from '@/components/tiktok-icon'
import TiktokVideosScroll from '@/components/tiktok-videos-scroll'
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
    DeleteWidgetButton,
    Widget as OptimisticWidget,
    WidgetContent,
    WidgetHeader,
    WidgetTitle,
} from '@/components/widget'
import { widgets } from '@/drizzle/schema'
import { InstagramPost, InstagramProfile } from '@/lib/api-helpers/instagram'
import { TiktokUser, TiktokVideo } from '@/lib/api-helpers/tiktok'
import { useQuery } from '@tanstack/react-query'
import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import {
    FacebookIcon,
    InstagramIcon,
    Loader,
    PlusIcon,
    XIcon,
    YoutubeIcon,
} from 'lucide-react'
import Link from 'next/link'
import { useOptimistic } from 'react'
import { createWidget, deleteWidget, setWidgetType } from './actions'
import PairAccountButton from './pair-account-button'

type OptimisticWidget = {
    id: string
    pos: number
    type?: InferSelectModel<typeof widgets>['type']
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
    const [optimisticWidgets, addWidget] = useOptimistic<
        OptimisticWidget[],
        OptimisticWidget
    >(userWidgets, (state, newWidget) => {
        if (newWidget.pos === -1) {
            return state.filter((w) => w.id !== newWidget.id)
        }
        if (state.find((w) => w.id === newWidget.id)) {
            return state.map((w) => (w.id === newWidget.id ? newWidget : w))
        }
        return [...state, newWidget]
    })

    const updateWidgetType = async (
        id: string,
        type: InferInsertModel<typeof widgets>['type']
    ) => {
        const oldWidget = optimisticWidgets.find((w) => w.id === id)
        if (!oldWidget) return
        addWidget({
            ...oldWidget,
            type,
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
        addWidget({ id, pos: optimisticWidgets.length })
        const error = await createWidget(id)
        if (error) {
            toast({
                title: 'Error adding widget',
                variant: 'destructive',
            })
        }
    }

    const removeWidget = async (id: string) => {
        addWidget({ id, pos: -1 })
        const error = await deleteWidget(id)
        if (error) {
            toast({
                title: 'Error removing widget',
                variant: 'destructive',
            })
        }
    }

    return (
        <>
            {optimisticWidgets
                .sort((a, b) => a.pos - b.pos)
                .map((widget) => (
                    <EditWidget
                        widget={widget}
                        deleteWidget={removeWidget}
                        updateWidgetType={updateWidgetType}
                        userId={userId}
                        key={widget.id}
                    />
                ))}
            <NewWidgetButton createWidget={addNewWidget} />
        </>
    )
}

function NewWidgetButton({
    createWidget,
}: {
    createWidget: () => Promise<void>
}) {
    return (
        <button
            onClick={createWidget}
            className="rounded-lg border bg-card text-card-foreground shadow-sm
                flex flex-col justify-center items-center hover:bg-card/70 transition-colors"
        >
            <PlusIcon className="h-24 w-24" />
            Add feed
        </button>
    )
}

function EditWidget({
    widget,
    userId,
    updateWidgetType,
    deleteWidget,
}: {
    widget: OptimisticWidget
    userId: string
    updateWidgetType: (
        id: string,
        type: InferInsertModel<typeof widgets>['type']
    ) => Promise<void>
    deleteWidget: (id: string) => Promise<void>
}) {
    const selectedFeed = widget.type

    return (
        <OptimisticWidget>
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
                <DeleteWidgetButton
                    onDelete={async () => deleteWidget(widget.id)}
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
        </OptimisticWidget>
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
                            <XIcon className="mr-1 fill-foreground w-4 h-4" />X
                            posts
                        </div>
                    </SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}

function TiktokWidgetFeed({ userId }: { userId: string }) {
    const { data: media, isLoading } = useQuery<{
        videos: TiktokVideo[]
        user: TiktokUser
    } | null>({
        queryFn: () => getTiktokMedia(userId),
        queryKey: ['tiktokMedia', userId],
        refetchOnWindowFocus: false,
    })

    return (
        <WidgetContent>
            {isLoading ? (
                <Loader className="h-4 w-4 animate-spin" />
            ) : media ? (
                <TiktokVideosScroll videos={media.videos} />
            ) : (
                <PairAccountButton
                    label={'Click to connect your Tiktok account'}
                    link={process.env.NEXT_PUBLIC_URL! + '/api/tiktok'}
                />
            )}
        </WidgetContent>
    )
}

function TiktokWidgetTitle({ userId }: { userId: string }) {
    const { data: media } = useQuery<{
        videos: TiktokVideo[]
        user: TiktokUser
    } | null>({
        queryFn: () => getTiktokMedia(userId),
        queryKey: ['tiktokMedia', userId],
        refetchOnWindowFocus: false,
    })

    return media?.user.username ? (
        <Link className="flex items-center" href={media.user.username}>
            <TiktokIcon className="mr-1 fill-foreground w-5 h-5" />
            <p>{media?.user.username}</p>
        </Link>
    ) : (
        <div className="flex items-center">
            <TiktokIcon className="mr-1 fill-foreground w-5 h-5" />
            <p>{media?.user.username}</p>
        </div>
    )
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

    return (
        <WidgetContent>
            {isLoading ? (
                <Loader className="h-4 w-4 animate-spin" />
            ) : media ? (
                <InstagramMediaScroll media={media.media} />
            ) : (
                <PairAccountButton
                    label={'Click to connect your Instagram account'}
                    link={process.env.NEXT_PUBLIC_URL! + '/api/ig'}
                />
            )}
        </WidgetContent>
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

    return media?.profile.username ? (
        <Link className="flex items-center" href={media.profile.username}>
            <InstagramIcon className="mr-1 text-pink-500 w-5 h-5" />
            <p>{media.profile.username}</p>
        </Link>
    ) : (
        <div className="flex items-center">
            <InstagramIcon className="mr-1 text-pink-500 w-5 h-5" />
            <p>Instagram media</p>
        </div>
    )
}
