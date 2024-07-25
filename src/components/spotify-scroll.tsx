import { SpotifyMedia } from '@/lib/api-helpers/spotify'
import { formatDistanceToNow } from 'date-fns'
import Image from 'next/image'
import Link from 'next/link'
import {
    Scroll,
    ScrollContent,
    ScrollItemCaption,
    ScrollItemFooter,
    ScrollItemTimestamp,
} from './scroll'
import { Separator } from './ui/separator'

export default function SpotifyScroll({ media }: { media: SpotifyMedia[] }) {
    return (
        <Scroll>
            <ScrollContent>
                {media
                    .filter((i) => !!i)
                    .map((track) => (
                        <div className="group">
                            <Link
                                href={track.trackUrl}
                                key={track.trackId}
                                className="flex items-center gap-3"
                            >
                                <Image
                                    height={60}
                                    width={60}
                                    alt=""
                                    className="rounded-md object-contain"
                                    src={track.albumImage}
                                />
                                <ScrollItemFooter>
                                    <ScrollItemCaption>
                                        {track.trackName}
                                        <p className="text-muted-foreground text-xs">
                                            {track.artistsNames}
                                        </p>
                                        <ScrollItemTimestamp>
                                            {!!track.playedAt &&
                                                formatDistanceToNow(
                                                    new Date(track.playedAt),
                                                    { addSuffix: true }
                                                )}
                                        </ScrollItemTimestamp>
                                    </ScrollItemCaption>
                                </ScrollItemFooter>
                            </Link>
                            <Separator className="my-2 group-last:hidden" />
                        </div>
                    ))}
            </ScrollContent>
        </Scroll>
    )
}
