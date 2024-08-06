import { getTimelineItems } from '@/app/actions/get-timeline-feed'
import { SocialLinkIcon } from '@/components/social-icons'
import { ScrollArea } from '@/components/ui/scroll-area'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'

export default async function TimelineScroll({ userId }: { userId: string }) {
    const timelineItems = await getTimelineItems(userId)

    if (timelineItems.length === 0)
        return <div className="h-min rounded-md border p-4">No updates</div>

    return (
        <ScrollArea className="flex h-min max-h-[80vh] flex-col overflow-y-auto border rounded-md text-card-foreground">
            {timelineItems.map((t) => (
                <div
                    key={t.id}
                    className="flex border-b p-4 last:border-none
                                    bg-card hover:bg-card/70 transition-colors items-center"
                >
                    <div className="flex w-full flex-wrap text-nowrap">
                        <div className="flex items-center">
                            <SocialLinkIcon
                                className="mr-2"
                                linkType={t.type}
                            />
                            <Link
                                className="underline-offset-4 hover:underline font-medium mr-1"
                                href={t.profile.link}
                            >
                                {t.profile.username}
                            </Link>
                        </div>
                        <Link className="flex-1" href={t.link || ''}>
                            {t.caption}
                        </Link>
                    </div>
                    <div className="flex justify-end pl-2 text-nowrap">
                        <p className="text-sm text-muted-foreground">
                            {!!t.timestamp &&
                                formatDistanceToNow(t.timestamp, {
                                    addSuffix: true,
                                })}
                        </p>
                    </div>
                </div>
            ))}
        </ScrollArea>
    )
}
