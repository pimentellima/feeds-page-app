import { PinterestPin } from '@/lib/api-helpers/pinterest'
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

export default function WidgetScrollPinterest({ media }: { media: PinterestPin[] }) {
    return (
        <WidgetScroll>
            <WidgetScrollContent>
                {media.map((pin) => (
                    <WidgetScrollItem href={pin.link} key={pin.id}>
                        <WidgetScrollItemImage
                            mediaUrl={pin.media.images['600x'].url}
                        />
                        <WidgetScrollItemFooter>
                            <WidgetScrollItemCaption>{pin.title}</WidgetScrollItemCaption>
                            <WidgetScrollItemTimestamp>
                                {!!pin.created_at &&
                                    formatDistanceToNow(
                                        new Date(pin.created_at),
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