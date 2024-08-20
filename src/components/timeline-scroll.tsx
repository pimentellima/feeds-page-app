import { TimelineItem } from '@/app/api/timeline/[userId]/route'
import { SocialLinkIcon } from '@/components/social-icons'
import { ScrollArea } from '@/components/ui/scroll-area'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'

async function getTimelineFeed(userId: string) {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_URL}/api/timeline/${userId}`,
            {
                method: 'GET',
            }
        )
        return (await res.json()) as TimelineItem[]
    } catch (e) {
        console.log(e)
        return null
    }
}

export default async function TimelineScroll({ userId }: { userId: string }) {
    const timelineItems = await getTimelineFeed(userId)
    if (!timelineItems)
        return (
            <div className="h-min rounded-md border p-4">
                Error fetching updates
            </div>
        )

    if (timelineItems.length === 0)
        return <div className="h-min rounded-md border p-4">No updates</div>

    return (
        <ScrollArea className="flex h-min max-h-[80vh] flex-col overflow-y-auto rounded-md text-card-foreground">
            {timelineItems.map((t) => (
                <div
                    key={t.id}
                    className="flex border-b p-4 last:border-none
                                    bg-card hover:bg-card/70 transition-colors items-center"
                >
                    <div className="flex w-full flex-wrap text-sm sm:text-base items-center gap-1">
                        <SocialLinkIcon linkType={t.type} />
                        <Link
                            className="underline-offset-4 hover:underline font-medium"
                            href={t.profile.link}
                        >
                            {t.profile.username}
                        </Link>
                        <Link className="sm:flex-1" href={t.link || ''}>
                            {t.caption}
                        </Link>
                        <div className="ml-1 flex justify-end flex-1">
                            <p className="text-xs md:text-sm text-muted-foreground text-nowrap">
                                {!!t.timestamp &&
                                    formatDistanceToNow(t.timestamp)}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </ScrollArea>
    )
}
