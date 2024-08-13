import getUserInstagramData from '@/lib/get-user-instagram-data'
import { NextRequest, NextResponse } from 'next/server'

export const revalidate = 600

export async function GET(
    req: NextRequest,
    { params }: { params: { userId: string } }
) {
    try {
        const instagramData = await getUserInstagramData(params.userId)
        return NextResponse.json(instagramData)
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
