import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export function POST(req: NextRequest, res: NextResponse) {
    try {
        const csrfState = Math.random().toString(36).substring(2)
        cookies().set('csrfState', csrfState, { maxAge: 60000 })
        const urlParams = new URLSearchParams({
            client_id: process.env.PINTEREST_CLIENT_ID!,
            scope: 'user_accounts:read,pins:read,boards:read',
            response_type: 'code',
            state: csrfState,
            redirect_uri: `${process.env.NEXT_PUBLIC_URL}/api/pinterest/callback`,
        })
        const url = 'https://www.pinterest.com/oauth/?' + urlParams
        return NextResponse.json({ url })
    } catch (e) {
        return NextResponse.json({ error: 'Internal error' }, { status: 500 })
    }
}
