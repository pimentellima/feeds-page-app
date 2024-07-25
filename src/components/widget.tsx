import { SocialLinkIcon } from '@/app/(profile)/profile/customize/social-icons'
import { InstagramProfile } from '@/lib/api-helpers/instagram'
import { SpotifyUserProfile } from '@/lib/api-helpers/spotify'
import { TiktokUser } from '@/lib/api-helpers/tiktok'
import { DraggableAttributes } from '@dnd-kit/core'
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities'
import { youtube_v3 } from 'googleapis'
import { GripIcon, Trash2Icon } from 'lucide-react'
import Link from 'next/link'
import { forwardRef, ReactNode } from 'react'
import InstagramIcon from './instagram-icon'
import TiktokIcon from './tiktok-icon'
import SpotifyIcon from './spotify-icon'

export function WidgetGrid({
    gridSize,
    children,
}: {
    gridSize: number
    children: ReactNode
}) {
    return (
        <div
            style={{
                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                gridAutoRows: 'min-content',
            }}
            className="flex flex-col gap-4 col-start-2 sm:grid
        sm:gap-4 sm:mt-20 pb-10 sm:pr-16 pt-5 sm:pt-0"
        >
            {children}
        </div>
    )
}

export const Widget = forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className="rounded-lg border bg-card text-card-foreground shadow-sm 
        text-sm h-[450px] hover:bg-card/70 transition-colors space-y-4"
        {...props}
    />
))

export function WidgetHeader({ children }: { children: ReactNode }) {
    return (
        <div className="flex justify-between w-full px-5 pt-5 pb-2">
            {children}
        </div>
    )
}
export function WidgetTitle({ children }: { children: ReactNode }) {
    return (
        <div
            className="text-base font-semibold leading-none tracking-tight"
        >
            {children}
        </div>
    )
}

export function WidgetOptions({
    onClickDelete,
    listeners,
    attributes,
    isDragging,
}: {
    onClickDelete: () => void
    listeners?: SyntheticListenerMap | undefined
    attributes?: DraggableAttributes
    isDragging?: boolean
}) {
    return (
        <div className="flex justify-end gap-3 items-center w-1/3">
            {listeners && attributes && (
                <button
                    style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                    {...listeners}
                    {...attributes}
                    title="Drag widget"
                >
                    <GripIcon className="h-5 w-5 text-muted-foreground" />
                </button>
            )}
            <button title="Delete widget" onClick={onClickDelete}>
                <Trash2Icon className="text-destructive h-5 w-5" />
            </button>
        </div>
    )
}

export function WidgetContent({ children }: { children: ReactNode }) {
    return (
        <div className="p-5 pt-0 flex justify-center w-full h-96 items-center">
            {children}
        </div>
    )
}

export function InstagramTitle({ profile }: { profile?: InstagramProfile }) {
    return profile ? (
        <Link
            className="flex items-center"
            href={'https://instagram.com/' + profile.username}
        >
            <InstagramIcon className="mr-1 text-pink-500 w-5 h-5" />
            <p>{profile.username}</p>
        </Link>
    ) : (
        <div className="flex items-center">
            <InstagramIcon className="mr-1 text-pink-500 w-5 h-5" />
        </div>
    )
}

export function TiktokTitle({ user }: { user?: TiktokUser }) {
    return user ? (
        <Link className="flex items-center" href={user.profile_deep_link}>
            <TiktokIcon className="mr-1 fill-foreground w-5 h-5" />
            <p>{user.username}</p>
        </Link>
    ) : (
        <div className="flex items-center">
            <TiktokIcon className="mr-1 fill-foreground w-5 h-5" />
        </div>
    )
}

export function YoutubeTitle({
    channel,
}: {
    channel?: youtube_v3.Schema$ChannelSnippet | null
}) {
    return channel?.customUrl ? (
        <Link
            className="flex items-center"
            href={'https://youtube.com/' + channel.customUrl}
        >
            <SocialLinkIcon className="mr-1" linkType="youtube" />
            <p>{channel.title}</p>
        </Link>
    ) : (
        <div className="flex items-center">
            <SocialLinkIcon linkType="youtube" />
        </div>
    )
}

export function SpotifyTitle({ profile }: { profile?: SpotifyUserProfile }) {
    return profile?.uri ? (
        <Link className="flex items-center" href={profile.uri}>
            <SpotifyIcon className="h-5 w-5 text-white fill-green-600  mr-1" />
            <p>{profile.display_name}</p>
        </Link>
    ) : (
        <div className="flex items-center">
            <SpotifyIcon className="h-5 w-5 text-white fill-green-600 " />
        </div>
    )
}
