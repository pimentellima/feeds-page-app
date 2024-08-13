import { formatDistanceToNow } from 'date-fns'
import Image from 'next/image'
import Link from 'next/link'
import {
    WidgetScroll,
    WidgetScrollContent,
    WidgetScrollItemCaption,
    WidgetScrollItemFooter,
    WidgetScrollItemTimestamp,
} from './widget-scroll'
import { Separator } from './ui/separator'
import { SpotifyPlayedTrack } from '@/types/spotify'

export default function WidgetScrollSpotify({ media }: { media: SpotifyPlayedTrack[] }) {
    return (
        <WidgetScroll>
            <WidgetScrollContent>
                {media
                    .filter((i) => !!i)
                    .map((track) => (
                        <div key={track.trackId} className="group">
                            <Link
                                href={track.trackUrl}
                                className="flex items-center gap-3"
                            >
                                <Image
                                    height={60}
                                    width={60}
                                    alt=""
                                    className="rounded-md object-contain"
                                    src={track.albumImage}
                                />
                                <WidgetScrollItemFooter>
                                    <WidgetScrollItemCaption>
                                        {track.trackName}
                                        <p className="text-muted-foreground text-xs">
                                            {track.artistsNames}
                                        </p>
                                        <WidgetScrollItemTimestamp>
                                            {!!track.playedAt &&
                                                'played ' + formatDistanceToNow(
                                                    new Date(track.playedAt),
                                                    { addSuffix: true }
                                                )}
                                        </WidgetScrollItemTimestamp>
                                    </WidgetScrollItemCaption>
                                </WidgetScrollItemFooter>
                            </Link>
                            <Separator className="my-2 group-last:hidden opacity-40" />
                        </div>
                    ))}
            </WidgetScrollContent>
        </WidgetScroll>
    )
}
