import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { oauth2Client } from '@/lib/google-oauth-client'

const scopes = ['https://www.googleapis.com/auth/youtube.readonly']

export function POST() {
    try {
        const csrfState = Math.random().toString(36).substring(2)
        cookies().set('csrfState', csrfState, { maxAge: 60000 })

        const url = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
            include_granted_scopes: true,
            state: csrfState,
            response_type: 'code',
        })

        return NextResponse.json({ url })
    } catch (e) {
        console.log(e)
        return NextResponse.json({ error: 'Internal error' }, { status: 500 })
    }
}
