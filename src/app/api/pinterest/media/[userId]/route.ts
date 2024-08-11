import getUserPinterestData from '@/lib/get-user-pinterest-data'
import { NextRequest, NextResponse } from 'next/server'

export const revalidate = 1200

export async function GET(
    req: NextRequest,
    { params }: { params: { userId: string } }
) {
    try {
        const pinterestData = await getUserPinterestData(params.userId)
        return NextResponse.json(pinterestData)
    } catch (e) {
        if (e instanceof Error) {
            return NextResponse.json(
                { message: e.message },
                {
                    status: (e.cause as any)?.status,
                    statusText: (e.cause as any)?.statusText,
                }
            )
        }
        return NextResponse.json({ message: 'Internal error' }, { status: 500 })
    }
}
