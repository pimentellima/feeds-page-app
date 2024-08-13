import getUserTiktokData from '@/lib/get-user-tiktok-data'
import { NextRequest, NextResponse } from 'next/server'

export const revalidate = 600

export async function GET(
    req: NextRequest,
    { params }: { params: { userId: string } }
) {
    try {
        const tiktokData = await getUserTiktokData(params.userId)
        return NextResponse.json(tiktokData)
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
