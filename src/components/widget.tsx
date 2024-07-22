import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { InstagramPost, InstagramProfile } from '@/lib/api-helpers/instagram'
import { TiktokUser } from '@/lib/api-helpers/tiktok'
import { DraggableAttributes } from '@dnd-kit/core'
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities'

import { GripIcon, InstagramIcon, Trash2Icon } from 'lucide-react'
import Link from 'next/link'
import { forwardRef, ReactNode } from 'react'
import TiktokIcon from './tiktok-icon'

export const Widget = forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <Card
        ref={ref}
        className="text-sm h-[450px] hover:bg-card/70 transition-colors space-y-4"
        {...props}
    />
))

export function WidgetHeader({ children }: { children: ReactNode }) {
    return (
        <CardHeader className="grid grid-cols-3 justify-items-center place-items-center">
            {children}
        </CardHeader>
    )
}
export function WidgetTitle({ children }: { children: ReactNode }) {
    return <CardTitle className="col-start-2 text-base">{children}</CardTitle>
}

export function WidgetOptions({
    onClickDelete,
    listeners,
    attributes,
}: {
    onClickDelete: () => void
    listeners: SyntheticListenerMap | undefined
    attributes: DraggableAttributes
}) {
    return (
        <div className="justify-self-end flex gap-2 items-center">
            <button
                className="cursor-grab"
                {...listeners}
                {...attributes}
                title="Drag widget"
            >
                <GripIcon className="h-4 w-4 text-muted-foreground" />
            </button>
            <button title="Delete widget" onClick={onClickDelete}>
                <Trash2Icon className="text-destructive h-4 w-4" />
            </button>
        </div>
    )
}

export function WidgetContent({ children }: { children: ReactNode }) {
    return (
        <CardContent className="flex justify-center w-full h-96 items-center">
            {children}
        </CardContent>
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
