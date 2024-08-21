'use server'
import {
    getInstagramAccessToken,
    getPinterestAccessToken,
    getSpotifyAccessToken,
    getTiktokAccessToken,
    getTwitchAccessToken,
    getYoutubeAccessToken,
} from '@/services/integration-tokens'

export async function getInstagramTokenState(userId: string) {
    try {
        await getInstagramAccessToken(userId)
        return 'Valid token'
    } catch (e) {
        if (e instanceof Error) {
            if (
                e.message === 'No access token' ||
                e.message === 'Invalid access token'
            )
                return e.message
            return 'Invalid access token'
        }
        return 'Invalid access token'
    }
}

export async function getTiktokTokenState(userId: string) {
    try {
        await getTiktokAccessToken(userId)
        return 'Valid token'
    } catch (e) {
        if (e instanceof Error) {
            if (
                e.message === 'No access token' ||
                e.message === 'Invalid access token'
            )
                return e.message
            return 'Invalid access token'
        }
        return 'Invalid access token'
    }
}

export async function getPinterestTokenState(userId: string) {
    try {
        await getPinterestAccessToken(userId)
        return 'Valid token'
    } catch (e) {
        if (e instanceof Error) {
            if (
                e.message === 'No access token' ||
                e.message === 'Invalid access token'
            )
                return e.message
            return 'Invalid access token'
        }
        return 'Invalid access token'
    }
}

export async function getTwitchTokenState(userId: string) {
    try {
        await getTwitchAccessToken(userId)
        return 'Valid token'
    } catch (e) {
        if (e instanceof Error) {
            if (
                e.message === 'No access token' ||
                e.message === 'Invalid access token'
            )
                return e.message
            return 'Invalid access token'
        }
        return 'Invalid access token'
    }
}

export async function getSpotifyTokenState(userId: string) {
    try {
        await getSpotifyAccessToken(userId)
        return 'Valid token'
    } catch (e) {
        if (e instanceof Error) {
            if (
                e.message === 'No access token' ||
                e.message === 'Invalid access token'
            )
                return e.message
            return 'Invalid access token'
        }
        return 'Invalid access token'
    }
}

export async function getYoutubeTokenState(userId: string) {
    try {
        await getYoutubeAccessToken(userId)
        return 'Valid token'
    } catch (e) {
        if (e instanceof Error) {
            if (
                e.message === 'No access token' ||
                e.message === 'Invalid access token'
            )
                return e.message
            return 'Invalid access token'
        }
        return 'Invalid access token'
    }
}
