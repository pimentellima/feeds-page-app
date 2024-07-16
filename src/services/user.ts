import 'server-only'
import { db } from '@/drizzle/index'
import { users } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'

export async function getUser(userId: string) {
    try {
        const user = await db.query.users.findFirst({
            where: eq(users.id, userId),
            with: { links: true, accountLinks: true },
        })

        if (!user) return null
        return user
    } catch {
        return null
    }
}

export async function updateUserImage(userId: string, url: string) {
    try {
        await db
            .update(users)
            .set({ imageUrl: url })
            .where(eq(users.id, userId))
    } catch (e) {
        console.log(e)
    }
}
