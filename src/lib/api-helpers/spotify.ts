import { SpotifyPlayedTrack, SpotifyProfile } from '@/types/spotify'

type SpotifyResponse = {
    href: string
    limit: number
    next: string
    cursors: {
        after: string
        before: string
    }
    total: number
    items: Array<{
        track: {
            album: {
                album_type: string
                total_tracks: number
                available_markets: string[]
                external_urls: {
                    spotify: string
                }
                href: string
                id: string
                images: Array<{
                    url: string
                    height: number
                    width: number
                }>
                name: string
                release_date: string
                release_date_precision: string
                restrictions: {
                    reason: string
                }
                type: string
                uri: string
                artists: Array<{
                    external_urls: {
                        spotify: string
                    }
                    href: string
                    id: string
                    name: string
                    type: string
                    uri: string
                }>
            }
            artists: Array<{
                external_urls: {
                    spotify: string
                }
                href: string
                id: string
                name: string
                type: string
                uri: string
            }>
            available_markets: string[]
            disc_number: number
            duration_ms: number
            explicit: boolean
            external_ids: {
                isrc: string
                ean: string
                upc: string
            }
            external_urls: {
                spotify: string
            }
            href: string
            id: string
            is_playable: boolean
            linked_from: Record<string, never>
            restrictions: {
                reason: string
            }
            name: string
            popularity: number
            preview_url: string
            track_number: number
            type: string
            uri: string
            is_local: boolean
        }
        played_at: string
        context: {
            type: string
            href: string
            external_urls: {
                spotify: string
            }
            uri: string
        }
    }>
}

type SpotifyUserProfile = {
    country: string
    display_name: string
    email: string
    explicit_content: {
        filter_enabled: boolean
        filter_locked: boolean
    }
    external_urls: {
        spotify: string
    }
    followers: {
        href: string
        total: number
    }
    href: string
    id: string
    images: Array<{
        url: string
        height: number
        width: number
    }>
    product: string
    type: string
    uri: string
}

interface SpotifyMedia {
    trackName: string
    artistsNames: string
    albumName: string
    playedAt: string
    albumImage: string
    trackUrl: string
    trackId: string
}

export async function fetchSpotifyMedia(
    accessToken: string
): Promise<SpotifyPlayedTrack[]> {
    const response = await fetch(
        'https://api.spotify.com/v1/me/player/recently-played?limit=10',
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        }
    )
    const json = (await response.json()) as SpotifyResponse
    if (!response.ok)
        throw new Error(
            response.status === 401
                ? 'Invalid access token'
                : 'Error fetching Spotify media',
            {
                cause: {
                    statusText: response.statusText,
                    status: response.status,
                },
            }
        )
    return json.items.map((item) => {
        const trackName = item.track.name
        const artistsNames = item.track.artists
            .map((artist) => artist.name)
            .join(', ')
        const albumName = item.track.album.name
        const playedAt = item.played_at
        const albumImage = item.track.album.images[0].url
        const trackUrl = item.track.external_urls.spotify
        const trackId: string = item.track.id

        return {
            trackName,
            artistsNames,
            albumName,
            trackId,
            playedAt,
            albumImage,
            trackUrl,
        }
    })
}

export async function fetchSpotifyProfile(
    accessToken: string
): Promise<SpotifyProfile> {
    const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    })
    if (!response.ok)
        throw new Error(
            response.status === 401
                ? 'Invalid access token'
                : 'Error fetching Spotify profile',
            {
                cause: {
                    statusText: response.statusText,
                    status: response.status,
                },
            }
        )
    const json = (await response.json()) as SpotifyUserProfile
    return { display_name: json.display_name, uri: json.uri }
}
