import {
    fetchYoutubeChannel,
    fetchYoutubeMedia,
} from '@/lib/api-helpers/youtube'
import { getYoutubeAccessToken } from '@/services/integration-tokens'
import { NextRequest, NextResponse } from 'next/server'

export const revalidate = 1200

export async function GET(
    req: NextRequest,
    { params }: { params: { userId: string } }
) {
    try {
        const accessToken = await getYoutubeAccessToken(params.userId)

        if (!accessToken)
            return NextResponse.json(
                { message: 'No access token' },
                { status: 401 }
            )

        const media = await fetchYoutubeMedia(accessToken)
        const channel = await fetchYoutubeChannel(accessToken)

        return NextResponse.json({
            media,
            channel,
        })
    } catch (e) {
        return NextResponse.json(
            { message: 'Failed fetching data' },
            { status: 500 }
        )
    }
}
