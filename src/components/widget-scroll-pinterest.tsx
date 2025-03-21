import { formatDistanceToNow } from 'date-fns'
import {
    WidgetScroll,
    WidgetScrollContent,
    WidgetScrollItem,
    WidgetScrollItemCaption,
    WidgetScrollItemFooter,
    WidgetScrollItemImage,
    WidgetScrollItemTimestamp,
} from './widget-scroll'
import { PinterestMedia } from '@/types/pinterest'

export default function WidgetScrollPinterest({
    media,
}: {
    media: PinterestMedia[]
}) {
    if (media.length === 0) return <p>No recent updates</p>

    return (
        <WidgetScroll>
            <WidgetScrollContent>
                {media.map((pin) => (
                    <WidgetScrollItem href={pin.url} key={pin.id}>
                        <WidgetScrollItemImage mediaUrl={pin.mediaUrl} />
                        <WidgetScrollItemFooter>
                            <WidgetScrollItemCaption>
                                {pin.title}
                            </WidgetScrollItemCaption>
                            <WidgetScrollItemTimestamp>
                                {!!pin.timestamp &&
                                    formatDistanceToNow(
                                        new Date(pin.timestamp + '.000Z'),
                                        { addSuffix: true }
                                    )}
                            </WidgetScrollItemTimestamp>
                        </WidgetScrollItemFooter>
                    </WidgetScrollItem>
                ))}
            </WidgetScrollContent>
        </WidgetScroll>
    )
}
