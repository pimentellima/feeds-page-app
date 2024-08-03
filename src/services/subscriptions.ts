import { db } from '@/drizzle/index'
import { subscriptions } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'
import 'server-only'

export async function getSubscriptionByUserId(userId: string) {
    const subscription = await db.query.subscriptions.findFirst({
        where: eq(subscriptions.userId, userId),
    })
    return subscription
}
