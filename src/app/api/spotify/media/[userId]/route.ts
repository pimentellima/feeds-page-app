import getUserSpotifyData from '@/lib/get-user-spotify-data'
import { NextRequest, NextResponse } from 'next/server'

export const revalidate = 600

export async function GET(
    req: NextRequest,
    { params }: { params: { userId: string } }
) {
    try {
        const spotifyData = await getUserSpotifyData(params.userId)
        return NextResponse.json(spotifyData)
    } catch (e) {
        console.log(e)
        if (e instanceof Error) {
            return NextResponse.json(
                { message: e.message },
                {
                    status: (e.cause as any).status || 500,
                    statusText: (e.cause as any).statusText,
                }
            )
        }
        return NextResponse.json({ message: 'Internal error' }, { status: 500 })
    }
}
