import {
    fetchPinterestUserMedia,
    fetchPinterestUserProfile,
} from '@/lib/api-helpers/pinterest'
import { getPinterestAccessToken } from '@/services/integration-tokens'
import { NextRequest, NextResponse } from 'next/server'

export const revalidate = 1200

export async function GET(
    req: NextRequest,
    { params }: { params: { userId: string } }
) {
    try {
        const accessToken = await getPinterestAccessToken(params.userId)

        if (!accessToken)
            return NextResponse.json(
                { message: 'No access token' },
                { status: 401 }
            )

        const media = await fetchPinterestUserMedia(accessToken)
        const user = await fetchPinterestUserProfile(accessToken)

        return NextResponse.json({
            media,
            user,
        })
    } catch (e) {
        return NextResponse.json(
            { message: 'Failed fetching data' },
            { status: 500 }
        )
    }
}
