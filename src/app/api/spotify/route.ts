import { NextApiRequest, NextApiResponse } from 'next'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export function POST(req: NextApiRequest, res: NextApiResponse) {
    try {
        const csrfState = Math.random().toString(36).substring(2)
        cookies().set('csrfState', csrfState, { maxAge: 60000 })
        const urlParams = new URLSearchParams({
            response_type: 'code',
            client_id: process.env.SPOTIFY_CLIENT_ID!,
            scope: 'user-read-recently-played',
            state: csrfState,
            redirect_uri: `${process.env.NEXT_PUBLIC_URL}/api/spotify/callback`,
        })
        const url = 'https://accounts.spotify.com/authorize?' + urlParams
        return NextResponse.json({ url })
    } catch (e) {
        return NextResponse.json({ error: 'Internal error' }, { status: 500 })
    }
}
