'use server'
import { db } from '@/drizzle/index'
import { integrationTokens, links, users, widgets } from '@/drizzle/schema'
import { auth } from '@/lib/auth'
import { utapi } from '@/server/uploadthing'
import { and, eq, InferSelectModel } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { UploadFileResult } from 'uploadthing/types'
import * as z from 'zod'
import { linkSchema, LinkValues } from './add-link-schema'

export async function addUserLink(values: LinkValues) {
    'use server'
    try {
        const session = await auth()
        if (!session?.user) return 'Unauthenticated'

        const validation = linkSchema.safeParse(values)
        if (validation.error) {
            return 'Error validating form values.'
        }

        if (values.id) {
            await db
                .update(links)
                .set({
                    title: values.title,
                    url: values.url,
                    showThumbnail: values.showThumbnail,
                })
                .where(eq(links.id, values.id))
        } else {
            await db.transaction(async (tx) => {
                const [insertedLink] = await tx
                    .insert(links)
                    .values({
                        title: values.title,
                        url: values.url,
                        showThumbnail: values.showThumbnail,
                    })
                    .returning()

              
            })
        }
        revalidatePath('/profile/customize')
    } catch {
        return 'An error occurred while saving the link.'
    }
}

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

export async function addIntegration(
    type: InferSelectModel<typeof widgets>['type']
) {
    try {
        const session = await auth()
        if (!session?.user) return 'Unauthenticated'
        const existingWidget = await db.query.widgets.findFirst({
            where: and(
                eq(widgets.userId, session.user.id),
                eq(widgets.type, type)
            ),
        })
        if (existingWidget)
            return 'Only one integration of the same type is allowed.'
        await db.insert(widgets).values({
            userId: session.user.id,
            type,
        })
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

        const widget = await db.query.widgets.findFirst({
            where: eq(widgets.id, id),
        })
        if (widget?.integrationTokenId) {
            await db
                .delete(integrationTokens)
                .where(eq(integrationTokens.id, widget.integrationTokenId))
        } else {
            await db.delete(widgets).where(eq(widgets.id, id))
        }
        revalidatePath('/profile/customize')
    } catch {
        return 'Error deleting widget'
    }
}
