export type SpotifyPlayedTrack = {
    trackName: string
    artistsNames: string
    albumName: string
    playedAt: string
    albumImage: string
    trackUrl: string
    trackId: string
}

export type SpotifyProfile = {
    display_name: string
    uri?: string
}