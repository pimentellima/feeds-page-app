import { NextApiRequest, NextApiResponse } from 'next'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export function POST(req: NextApiRequest, res: NextApiResponse) {
    try {
        const csrfState = Math.random().toString(36).substring(2)
        cookies().set('csrfState', csrfState, { maxAge: 60000 })
        const urlParams = new URLSearchParams({
            client_id: process.env.INSTAGRAM_APP_ID!,
            scope: 'user_profile,user_media',
            response_type: 'code',
            state: csrfState,
            redirect_uri: `${process.env.NEXT_PUBLIC_URL}/api/ig/callback`,
        })
        const url = 'https://api.instagram.com/oauth/authorize/?' + urlParams
        return NextResponse.json({ url })
    } catch (e) {
        return NextResponse.json({ error: 'Internal error' }, { status: 500 })
    }
}
