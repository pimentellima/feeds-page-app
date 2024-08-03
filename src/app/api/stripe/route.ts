import { db } from '@/drizzle/index'
import { subscriptions, users } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    typescript: true,
})

// const secret = process.env.STRIPE_WEBHOOK_SECRET || ''
const secret = 'whsec_f39219190a7a304c24e2eb8b5fb42692825795bde528d4871fda7ce65d0b20b1'

export async function POST(req: Request) {
    try {
        const body = await req.text()
        const signature = headers().get('stripe-signature')
        if (!signature)
            return NextResponse.json(
                { message: 'No stripe signature' },
                { status: 400 }
            )
        const event = stripe.webhooks.constructEvent(body, signature, secret)

        if (event.type === 'payment_intent.succeeded') {
            const userId = event.data.object.metadata.userId as
                | string
                | undefined
            if (!userId)
                return NextResponse.json(
                    { message: 'User id not found in object metadata' },
                    { status: 500 }
                )

            await db.insert(subscriptions).values({ userId })
        }

        return NextResponse.json({ result: event, ok: true })
    } catch (error) {
        return NextResponse.json(
            {
                message: 'Internal error',
                error,
            },
            { status: 500 }
        )
    }
}
