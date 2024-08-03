import { PinterestPin } from '@/lib/api-helpers/pinterest'
import { formatDistanceToNow } from 'date-fns'
import {
    Scroll,
    ScrollContent,
    ScrollItem,
    ScrollItemCaption,
    ScrollItemFooter,
    ScrollItemImage,
    ScrollItemTimestamp,
} from './scroll'

export default function PinterestScroll({ media }: { media: PinterestPin[] }) {
    return (
        <Scroll>
            <ScrollContent>
                {media.map((pin) => (
                    <ScrollItem href={pin.link} key={pin.id}>
                        <ScrollItemImage
                            mediaUrl={pin.media.images['400x300'].url}
                        />
                        <ScrollItemFooter>
                            <ScrollItemCaption>
                                {pin.description}
                            </ScrollItemCaption>
                            <ScrollItemTimestamp>
                                {!!pin.created_at &&
                                    formatDistanceToNow(
                                        new Date(pin.created_at),
                                        { addSuffix: true }
                                    )}
                            </ScrollItemTimestamp>
                        </ScrollItemFooter>
                    </ScrollItem>
                ))}
            </ScrollContent>
        </Scroll>
    )
}
