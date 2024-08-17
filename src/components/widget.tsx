import { DraggableAttributes } from '@dnd-kit/core'
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities'
import { GripIcon, Trash2Icon } from 'lucide-react'
import Link from 'next/link'
import { forwardRef, ReactNode } from 'react'
import InstagramIcon from './instagram-icon'
import TiktokIcon from './tiktok-icon'
import SpotifyIcon from './spotify-icon'
import { SocialLinkIcon } from './social-icons'
import { SpotifyProfile } from '@/types/spotify'
import TwitchIcon from './twitch-icon'

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
                gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
            }}
            className="flex flex-col lg:grid w-full gap-4"
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
        className="rounded-lg bg-card text-card-foreground shadow-md
        text-sm h-[450px] hover:bg-card/70 transition-colors space-y-4 font-sans p-5"
        {...props}
    />
))

export function WidgetHeader({ children }: { children: ReactNode }) {
    return <div className="flex justify-between w-full">{children}</div>
}
export function WidgetTitle({ children }: { children: ReactNode }) {
    return (
        <div className="text-base font-semibold leading-none tracking-tight">
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
        <div className="flex justify-center w-full h-96 items-center mt-5">
            {children}
        </div>
    )
}

export function WidgetTitleInstagram({
    profile,
}: {
    profile?: { username?: string }
}) {
    return profile ? (
        <Link
            className="flex"
            href={'https://instagram.com/' + profile.username}
        >
            <InstagramIcon className="mr-1 text-pink-500 w-5 h-5" />
            <p>{profile.username}</p>
        </Link>
    ) : (
        <div className="flex">
            <InstagramIcon className="mr-1 text-pink-500 w-5 h-5" />
        </div>
    )
}

export function WidgetTitleTiktok({
    user,
}: {
    user?: { username: string; profile_deep_link: string }
}) {
    return user ? (
        <Link className="flex" href={user.profile_deep_link}>
            <TiktokIcon className="mr-1 fill-foreground w-5 h-5" />
            <p>{user.username}</p>
        </Link>
    ) : (
        <div className="flex">
            <TiktokIcon className="mr-1 fill-foreground w-5 h-5" />
        </div>
    )
}

export function WidgetTitleYoutube({
    channel,
}: {
    channel?: { url?: string | null; title?: string | null } | null
}) {
    return channel?.url ? (
        <Link className="flex" href={'https://youtube.com/' + channel.url}>
            <SocialLinkIcon className="mr-1" linkType="youtube" />
            <p>{channel.title}</p>
        </Link>
    ) : (
        <div className="flex">
            <SocialLinkIcon linkType="youtube" />
        </div>
    )
}

export function WidgetTitleSpotify({ profile }: { profile?: SpotifyProfile }) {
    return profile?.uri ? (
        <Link className="flex" href={profile.uri}>
            <SpotifyIcon className="h-5 w-5 text-white fill-green-600  mr-1" />
            <p>{profile.display_name}</p>
        </Link>
    ) : (
        <div className="flex items-center">
            <SpotifyIcon className="mr-1 h-5 w-5 text-white fill-green-600 " />
        </div>
    )
}

export function WidgetTitlePinterest({
    profile,
}: {
    profile?: { username?: string } | null
}) {
    return profile?.username ? (
        <Link
            className="flex"
            href={'https://pinterest.com/' + profile.username}
        >
            <SocialLinkIcon
                className="sm:h-5 sm:w-5 mr-1"
                linkType="pinterest"
            />
            <p>{profile.username}</p>
        </Link>
    ) : (
        <div className="flex">
            <SocialLinkIcon className="sm:h-5 sm:w-5" linkType="pinterest" />
        </div>
    )
}

export function WidgetTitleTwitch({ user }: { user?: { username: string } }) {
    return user ? (
        <Link className="flex" href={'https://www.twitch.tv/' + user.username}>
            <TwitchIcon className="mr-1 text-purple-700 w-5 h-5" />
            <p>{user.username}</p>
        </Link>
    ) : (
        <div>
            <TwitchIcon className="mr-1 text-purple-700 w-5 h-5" />
        </div>
    )
}
