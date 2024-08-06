import {
    fetchInstagramMedia,
    fetchInstagramProfile,
} from '@/lib/api-helpers/instagram'
import { getInstagramAccessToken } from '@/services/integration-tokens'
import { NextRequest, NextResponse } from 'next/server'

export const revalidate = 1200

export async function GET(
    req: NextRequest,
    { params }: { params: { userId: string } }
) {
    try {
        const accessToken = await getInstagramAccessToken(params.userId)

        if (!accessToken)
            return NextResponse.json(
                { message: 'No access token' },
                { status: 401 }
            )

        const media = await fetchInstagramMedia(accessToken)
        const profile = await fetchInstagramProfile(accessToken)

        return NextResponse.json({
            profile,
            media,
        })
    } catch (e) {
        return NextResponse.json(
            { message: 'Failed fetching data' },
            { status: 500 }
        )
    }
}
