import { InstagramProfile } from '@/lib/api-helpers/instagram'
import { TiktokUser } from '@/lib/api-helpers/tiktok'
import { DraggableAttributes } from '@dnd-kit/core'
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities'
import { GripIcon, Trash2Icon } from 'lucide-react'
import Link from 'next/link'
import { forwardRef, ReactNode } from 'react'
import TiktokIcon from './tiktok-icon'
import InstagramIcon from './instagram-icon'

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
        <div className="grid grid-cols-3 w-full flex-row p-5">{children}</div>
    )
}
export function WidgetTitle({ children }: { children: ReactNode }) {
    return (
        <div
            className="flex justify-center text-base col-start-2
                font-semibold leading-none tracking-tight"
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
    listeners: SyntheticListenerMap | undefined
    attributes: DraggableAttributes
    isDragging: boolean
}) {
    return (
        <div className="justify-self-end flex gap-3 items-center">
            <button
                style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                {...listeners}
                {...attributes}
                title="Drag widget"
            >
                <GripIcon className="h-5 w-5 text-muted-foreground" />
            </button>
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
