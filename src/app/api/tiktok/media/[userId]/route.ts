import { fetchTiktokMedia, fetchTiktokUser } from '@/lib/api-helpers/tiktok'
import { getTiktokAccessToken } from '@/services/integration-tokens'
import { NextRequest, NextResponse } from 'next/server'

export const revalidate = 1200

export async function GET(
    req: NextRequest,
    { params }: { params: { userId: string } }
) {
    try {
        const accessToken = await getTiktokAccessToken(params.userId)

        if (!accessToken)
            return NextResponse.json(
                { message: 'No access token' },
                { status: 401 }
            )

        const videos = await fetchTiktokMedia(accessToken)
        const user = await fetchTiktokUser(accessToken)

        return NextResponse.json({
            videos,
            user,
        })
    } catch (e) {
        console.log(e)
        return NextResponse.json(
            { message: 'Failed fetching data' },
            { status: 500 }
        )
    }
}
