import { db } from '@/drizzle/index'
import { users, widgets } from '@/drizzle/schema'
import { asc, eq } from 'drizzle-orm'
import { cache } from 'react'
import 'server-only'

export const getUserByUsername = cache(async (username: string) => {
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
})

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
