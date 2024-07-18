import { db } from '@/drizzle/index'
import { users } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'
import 'server-only'

export async function getUser(userId: string) {
    const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
        with: {
            widgets: {
                with: {
                    link: true,
                    integrationToken: true,
                },
            },
        },
    })
    if (!user) throw new Error('')
    return user
}

export async function updateUserImage(userId: string, url: string) {
    try {
        await db
            .update(users)
            .set({ imageUrl: url })
            .where(eq(users.id, userId))
    } catch (e) {
        return 'An error occured while updating user image'
    }
}
