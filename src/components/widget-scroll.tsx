import Image from 'next/image'
import Link from 'next/link'
import { ReactNode } from 'react'
import { ScrollArea } from './ui/scroll-area'
import { Separator } from './ui/separator'

export function WidgetScroll({ children }: { children: ReactNode }) {
    return <ScrollArea className="h-96 w-full">{children}</ScrollArea>
}
export function WidgetScrollContent({ children }: { children: ReactNode }) {
    return <div className="grid gap-2">{children}</div>
}
export function WidgetScrollItem({
    children,
    href,
}: {
    children: ReactNode
    href?: string
}) {
    return (
        <div className="group">
            <Link
                href={href || '/404'}
                className="flex flex-col justify-center items-center "
            >
                {children}
            </Link>
            <Separator className="my-4 group-last:hidden opacity-40" />
        </div>
    )
}
export function WidgetScrollItemImage({ mediaUrl }: { mediaUrl: string }) {
    return (
        <Image
            className="rounded-md object-contain mb-2"
            quality={100}
            src={mediaUrl}
            alt="Post image"
            width={280}
            height={280}
        />
    )
}
export function WidgetScrollItemFooter({ children }: { children: ReactNode }) {
    return <div className="grid gap-1 text-center w-full">{children}</div>
}
export function WidgetScrollItemCaption({ children }: { children: ReactNode }) {
    return (
        <div className="overflow-hidden whitespace-nowrap text-ellipsis flex flex-col">
            {children}
        </div>
    )
}
export function WidgetScrollItemTimestamp({
    children,
}: {
    children: ReactNode
}) {
    return <div className="text-muted-foreground text-xs">{children}</div>
}
