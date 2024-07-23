import { db } from '@/drizzle/index'
import { users, widgets } from '@/drizzle/schema'
import { asc, eq } from 'drizzle-orm'
import 'server-only'

export async function getUserByUsername(username: string) {
    const user = await db.query.users.findFirst({
        where: eq(users.username, username),
        columns: {
            password: false,
        },
        with: {
            widgets: {
                orderBy: [asc(widgets.pos)],
            },
            integrationTokens: true,
            socialLinks: true,
        },
    })
    if (!user) throw new Error('')
    return user
}

export async function getUser(userId: string) {
    const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
        columns: {
            password: false,
        },
        with: {
            widgets: true,
            socialLinks: true,
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
