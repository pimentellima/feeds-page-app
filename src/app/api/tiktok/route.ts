import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export function POST() {
    try {
        const csrfState = Math.random().toString(36).substring(2)
        cookies().set('csrfState', csrfState, { maxAge: 60000 })
        const urlParams = new URLSearchParams({
            client_key: process.env.TIKTOK_CLIENT_ID!,
            scope: 'user.info.basic,video.list,user.info.profile',
            response_type: 'code',
            state: csrfState,
            redirect_uri: `${process.env.NEXT_PUBLIC_URL}/api/tiktok/callback`,
        })
        const url = 'https://www.tiktok.com/v2/auth/authorize/?' + urlParams
        return NextResponse.json({ url })
    } catch (e) {
        return NextResponse.json({ error: 'Internal error' }, { status: 500 })
    }
}
