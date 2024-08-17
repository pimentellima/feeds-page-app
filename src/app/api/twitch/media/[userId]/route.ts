import getUserTwitchData from '@/lib/get-user-twitch-data'
import { NextRequest, NextResponse } from 'next/server'

// export const revalidate = 600

export async function GET(
    req: NextRequest,
    { params }: { params: { userId: string } }
) {
    try {
        const twitchData = await getUserTwitchData(params.userId)
        return NextResponse.json(twitchData)
    } catch (e) {
        if (e instanceof Error) {
            return NextResponse.json(
                { message: e.message },
                {
                    status: (e.cause as any)?.status || 500,
                    statusText: (e.cause as any)?.statusText,
                }
            )
        }
        return NextResponse.json({ message: 'Internal error' }, { status: 500 })
    }
}
