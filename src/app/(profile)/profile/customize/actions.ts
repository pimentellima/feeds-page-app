'use server'
import { db } from '@/drizzle/index'
import { links, users, widgets } from '@/drizzle/schema'
import { auth } from '@/lib/auth'
import { utapi } from '@/server/uploadthing'
import { and, eq, InferInsertModel, sql } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { UploadFileResult } from 'uploadthing/types'
import * as z from 'zod'

export async function deleteUserLink(linkId: string) {
    await db.delete(links).where(eq(links.id, linkId))
    revalidatePath('/profile/customize')
}

export async function updateUsernameAndBio(formData: FormData) {
    try {
        const session = await auth()
        if (!session?.user) return 'Unauthenticated'
        const validation = z
            .object({
                name: z
                    .string()
                    .max(20, {
                        message: 'Name must be 20 characters or less',
                    })
                    .min(1, { message: 'Name is required' }),
                bio: z
                    .string()
                    .max(150, { message: 'Bio must be 150 characters or less' })
                    .optional(),
            })
            .safeParse({
                name: formData.get('name'),
                bio: formData.get('bio'),
            })
        if (validation.error) return validation.error.issues[0].message

        const { name, bio } = validation.data

        await db
            .update(users)
            .set({ bio, name })
            .where(eq(users.id, session.user.id))
        revalidatePath('/profile/customize')
    } catch (e) {
        console.log(e)
        return 'An error occurred while saving the bio.'
    }
}

export async function updateUserImage(formData: FormData) {
    const file: File | null = formData.get('file') as unknown as File
    if (!file) return 'No files selected'
    try {
        const session = await auth()
        if (!session?.user) return 'Unauthenticated'

        const response: UploadFileResult = await utapi.uploadFiles(file)
        if (response.error) {
            return 'An error occurred'
        }
        if (response.data.url) {
            await db
                .update(users)
                .set({ imageUrl: response.data.url })
                .where(eq(users.id, session.user.id))
            revalidatePath('/profile/customize')
        }
    } catch (e) {
        console.log(e)
        return 'An error occurred'
    }
}

export async function updateUserTheme(theme: string) {
    try {
        const session = await auth()
        if (!session?.user) return 'Unauthenticated'

        await db
            .update(users)
            .set({ theme: theme })
            .where(eq(users.id, session.user.id))
        revalidatePath('/profile/customize')
    } catch (e) {
        return 'An error occurred'
    }
}

export async function createWidget(id: string) {
    try {
        const session = await auth()
        if (!session?.user) return 'Unauthenticated'

        await db.insert(widgets).values({
            id,
            userId: session.user.id,
        })
        revalidatePath('/profile/customize')
    } catch (e) {
        console.log(e)
        return 'Error adding integration'
    }
}

export async function setWidgetType(
    id: string,
    type: InferInsertModel<typeof widgets>['type']
) {
    try {
        const session = await auth()
        if (!session?.user) return 'Unauthenticated'

        await db
            .update(widgets)
            .set({
                type,
            })
            .where(eq(widgets.id, id))
        revalidatePath('/profile/customize')
    } catch (e) {
        console.log(e)
        return 'Error adding integration'
    }
}

export async function deleteWidget(id: string) {
    try {
        const session = await auth()
        if (!session?.user) return 'Unauthenticated'

        await db.delete(widgets).where(eq(widgets.id, id))
        revalidatePath('/profile/customize')
    } catch {
        return 'Error deleting widget'
    }
}

export async function updateWidgetPosition(
    widgetId: string,
    newPosition: number
) {
    try {
        const session = await auth()
        if (!session?.user) return 'Unauthenticated'
        const widget = await db.query.widgets.findFirst({
            where: eq(widgets.id, widgetId),
            columns: { pos: true },
        })
        if (!widget) return 'Widget not found'

        if (!widgetId) return 'Widget not found'
        await db.transaction(async (db) => {
            if (newPosition === widget.pos) return
            if (newPosition < widget.pos) {
                await db
                    .update(widgets)
                    .set({ pos: sql`${widgets.pos} + 1` })
                    .where(
                        and(
                            eq(widgets.userId, session.user.id),
                            sql`${widgets.pos} >= ${newPosition}`
                        )
                    )
            }

            if (newPosition > widget.pos) {
                await db
                    .update(widgets)
                    .set({ pos: sql`${widgets.pos} - 1` })
                    .where(
                        and(
                            eq(widgets.userId, session.user.id),
                            sql`${widgets.pos} <= ${newPosition}`
                        )
                    )
            }
            await db
                .update(widgets)
                .set({ pos: newPosition })
                .where(eq(widgets.id, widgetId))
        })
        revalidatePath('/profile/customize')
    } catch {
        return 'Error updating widget position'
    }
}
