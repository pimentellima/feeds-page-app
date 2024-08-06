import {
    fetchSpotifyMedia,
    fetchSpotifyProfile,
} from '@/lib/api-helpers/spotify'
import { getSpotifyAccessToken } from '@/services/integration-tokens'
import { NextRequest, NextResponse } from 'next/server'

export const revalidate = 1200

export async function GET(
    req: NextRequest,
    { params }: { params: { userId: string } }
) {
    try {
        const accessToken = await getSpotifyAccessToken(params.userId)

        if (!accessToken)
            return NextResponse.json(
                { message: 'No access token' },
                { status: 401 }
            )

        const media = await fetchSpotifyMedia(accessToken)
        const profile = await fetchSpotifyProfile(accessToken)

        return NextResponse.json({
            media,
            profile,
        })
    } catch (e) {
        return NextResponse.json(
            { message: 'Failed fetching data' },
            { status: 500 }
        )
    }
}
