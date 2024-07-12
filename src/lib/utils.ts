import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function getYoutubeThumbnailFromUrl(url: string) {
    const isValidUrl =
        /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/.test(url)
    if (!isValidUrl) return ''

    const videoId = url.split('v=')[1]
    if(!videoId) return ''
    const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    return thumbnail
}

export function getUrlType(url: string) {
    const isYoutube = /^(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/.test(url)
    const isInstagram = /^(https?\:\/\/)?(www\.)?instagram\.com\/.+$/.test(url)
    const isTwitter = /^(https?\:\/\/)?(www\.)?twitter\.com\/.+$/.test(url)
    const isX = /^(https?\:\/\/)?(www\.)?x\.com\/.+$/.test(url)
    if (isYoutube) return 'youtube'
    if (isInstagram) return 'instagram'
    if (isTwitter) return 'twitter'
    if (isX) return 'x'
    return 'other'
}