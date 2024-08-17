export const REFRESH_TOKEN_TTL = 3 * 24 * 60 * 60 * 1000 // 3 dias
export const ACCESS_TOKEN_TTL = 1000 * 60 * 10 // 10 minutos

export const YOUTUBE_MEDIA_STALE_TIME_MS = 1000 * 60 * 60 * 2 // 2 horas
export const TWITCH_MEDIA_STALE_TIME_MS = 1000 * 60 * 30 // 30 minutos
export const PINTEREST_MEDIA_STALE_TIME_MS = 1000 * 60 * 30 // 30 minutos
export const INSTAGRAM_MEDIA_STALE_TIME_MS = 1000 * 60 * 30 // 30 minutos
export const TIKTOK_MEDIA_STALE_TIME_MS = 1000 * 60 * 30 // 30 minutos
export const SPOTIFY_MEDIA_STALE_TIME_MS = 1000 * 60 * 30 // 30 minutos

export const planPrice =
    process.env.NODE_ENV === 'production'
        ? 'price_1PjqDJEyugco4uX21basTws9'
        : 'price_1PjqYkEyugco4uX2723GUXyS'

export const themes = [
    { name: 'default', gradient: '#0b2b13' },
    { name: 'walnut-brown', gradient: '#f3ece4' },
    { name: 'dark-cyan', gradient: '#091a1d' },
    { name: 'aspargus-green', gradient: '#e9ece8' },
    { name: 'ultra-pink', gradient: '#270b1e' },
    { name: 'blush-pink', gradient: '#fccfcf' },
    { name: 'lavender-mist', gradient: '#1e0e2d' },
    { name: 'pastel-blue', gradient: '#e1e4f3' },
    { name: 'dark-chocolate', gradient: '#34220e' },
    { name: 'pale-rose', gradient: '#f2e5e5' },
]
