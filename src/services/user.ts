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
            integrationTokens: true,
        },
    })
    if (!user) throw new Error('')
    return user
}
