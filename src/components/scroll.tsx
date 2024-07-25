import Image from 'next/image'
import Link from 'next/link'
import { ReactNode } from 'react'
import { ScrollArea } from './ui/scroll-area'
import { Separator } from './ui/separator'

export function Scroll({ children }: { children: ReactNode }) {
    return <ScrollArea className="h-96 w-full pb-4 pr-4">{children}</ScrollArea>
}
export function ScrollContent({ children }: { children: ReactNode }) {
    return <div className="grid gap-2">{children}</div>
}
export function ScrollItem({
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
            <Separator className="my-4 group-last:hidden" />
        </div>
    )
}
export function ScrollItemImage({ mediaUrl }: { mediaUrl: string }) {
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
export function ScrollItemFooter({ children }: { children: ReactNode }) {
    return (
        <div className="grid gap-1 text-center w-full">
            {children}
        </div>
    )
}
export function ScrollItemCaption({ children }: { children: ReactNode }) {
    return (
        <div className="overflow-hidden whitespace-nowrap text-ellipsis flex flex-col">
            {children}
        </div>
    )
}
export function ScrollItemTimestamp({ children }: { children: ReactNode }) {
    return <div className="text-muted-foreground text-xs">{children}</div>
}
