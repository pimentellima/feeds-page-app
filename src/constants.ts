export const REFRESH_TOKEN_TTL = 3 * 24 * 60 * 60 * 1000 // 3 dias
export const ACCESS_TOKEN_TTL = 1000 * 60 * 10 // 10 minutos

export const YOUTUBE_MEDIA_STALE_TIME_MS = 1000 * 60 * 60 * 2 // 2 horas
export const PINTEREST_MEDIA_STALE_TIME_MS = 1000 * 60 * 30 // 30 minutos
export const INSTAGRAM_MEDIA_STALE_TIME_MS = 1000 * 60 * 30 // 30 minutos
export const TIKTOK_MEDIA_STALE_TIME_MS = 1000 * 60 * 30 // 30 minutos
export const SPOTIFY_MEDIA_STALE_TIME_MS = 1000 * 60 * 30 // 30 minutos

export const planPrice =
    process.env.NODE_ENV === 'production'
        ? 'price_1PjqDJEyugco4uX21basTws9'
        : 'price_1PjqYkEyugco4uX2723GUXyS'

export const themes = [
    { name: 'default', label: 'Default', gradient: '#c1dfc4' },
    { name: 'aspargus-green', label: 'Asparagus green', gradient: '#215f00' },
    { name: 'ultra-pink', label: 'Ultra pink', gradient: '#f857a6' },
    { name: 'lavender-mist', label: 'Lavender mist', gradient: '#ddd6f3' },
    { name: 'mango-tango', label: 'Mango tango', gradient: '#FD8112' },
    { name: 'walnut-brown', label: 'Walnut brown', gradient: '#603813' },
    { name: 'dark-chocolate', label: 'Dark chocolate', gradient: '#fdfcfb' },
    { name: 'blush-pink', label: 'Blush Pink', gradient: '#fccfcf' },
    { name: 'charcoal-blue', label: 'Charcoal blue', gradient: '#314755' },
    { name: 'vivid-red', label: 'Vivid red', gradient: '#F00000' },
]
