'use client'
import { getTiktokMedia } from '@/app/actions/get-tiktok-media'
import TiktokVideosScroll from '@/components/tiktok-videos-scroll'
import TiktokIcon from '@/components/tiktok-icon'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Widget,
    WidgetContent,
    WidgetHeader,
    DeleteWidgetButton,
    WidgetTitle,
} from '@/components/widget'
import { links, widgets } from '@/drizzle/schema'
import { TiktokUser, TiktokVideo } from '@/lib/api-helpers/tiktok'
import { useQuery } from '@tanstack/react-query'
import { InferSelectModel } from 'drizzle-orm'
import {
    FacebookIcon,
    InstagramIcon,
    Loader,
    PlusIcon,
    XIcon,
    YoutubeIcon,
} from 'lucide-react'
import Link from 'next/link'
import { Dispatch, SetStateAction, useState } from 'react'
import PairAccountButton from './pair-account-button'
import { getInstagramMedia } from '@/app/actions/get-instagram-media'
import { InstagramPost, InstagramProfile } from '@/lib/api-helpers/instagram'
import InstagramMediaScroll from '@/components/instagram-feed'

type Widget = {
    id: string
    pos: number
    type?: InferSelectModel<typeof widgets>['type']
    link?: InferSelectModel<typeof links> | null
    integrationToken?: { id: string } | null
}

interface CustomizeWidgetsPanelProps {
    userWidgets: Widget[]
    userId: string
}

export function CustomizeWidgetsPanel({
    userId,
    userWidgets,
}: CustomizeWidgetsPanelProps) {
    const [widgets, setWidgets] = useState(userWidgets)

    const sortedWidgets = widgets.sort((a, b) => a.pos - b.pos)

    return (
        <>
            {sortedWidgets.map((widget) => (
                <EditWidget
                    setWidgets={setWidgets}
                    userId={userId}
                    widgetId={widget.id}
                    key={widget.id}
                />
            ))}
            <NewWidgetButton setWidgets={setWidgets} />
        </>
    )
}

function NewWidgetButton({
    setWidgets,
}: {
    setWidgets: Dispatch<SetStateAction<Widget[]>>
}) {
    return (
        <button
            onClick={() =>
                setWidgets((prev) => [
                    ...prev,
                    { id: crypto.randomUUID(), pos: 0 },
                ])
            }
            className="rounded-lg border bg-card text-card-foreground shadow-sm
                flex flex-col justify-center items-center hover:bg-card/70 transition-colors"
        >
            <PlusIcon className="h-24 w-24" />
            Add feed
        </button>
    )
}

function EditWidget({
    widgetId,
    setWidgets,
    userId,
}: {
    widgetId: string
    setWidgets: Dispatch<SetStateAction<Widget[]>>
    userId: string
}) {
    const [selectedFeed, setSelectedFeed] = useState<string | undefined>()

    return (
        <Widget>
            <WidgetHeader>
                <WidgetTitle>
                    {selectedFeed === 'tiktok' ? (
                        <TiktokWidgetTitle userId={userId} />
                    ) : selectedFeed === 'instagram' ? (
                        <InstagramWidgetTitle userId={userId} />
                    ) : (
                        'New widget'
                    )}
                </WidgetTitle>
                <DeleteWidgetButton
                    onDelete={() =>
                        setWidgets((widgets) =>
                            widgets.filter((w) => w.id !== widgetId)
                        )
                    }
                />
            </WidgetHeader>
            <WidgetContent>
                {selectedFeed === 'tiktok' ? (
                    <TiktokWidgetFeed userId={userId} />
                ) : selectedFeed === 'instagram' ? (
                    <InstagramWidgetFeed userId={userId} />
                ) : (
                    <WidgetTypeSelect
                        setValue={setSelectedFeed}
                        value={selectedFeed}
                    />
                )}
            </WidgetContent>
        </Widget>
    )
}

function WidgetTypeSelect({
    value,
    setValue,
}: {
    value: string | undefined
    setValue: (value: string) => void
}) {
    return (
        <Select value={value} onValueChange={(value) => setValue(value)}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a feed type" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectItem value="tiktok">
                        <div className="flex items-center">
                            <TiktokIcon className="mr-1 fill-foreground w-4 h-4" />
                            Tiktok videos
                        </div>
                    </SelectItem>
                    <SelectItem value="instagram">
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
            <p>Instagram feed</p>
        </div>
    )
}
