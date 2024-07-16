'use server'
import { db } from '@/drizzle/index'
import { accountLinks, userLinks, users } from '@/drizzle/schema'
import { auth } from '@/lib/auth'
import { utapi } from '@/server/uploadthing'
import { eq } from 'drizzle-orm'
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
                .update(userLinks)
                .set({
                    title: values.title,
                    url: values.url,
                    showThumbnail: values.showThumbnail,
                })
                .where(eq(userLinks.id, values.id))
        } else {
            await db.insert(userLinks).values({
                userId: session.user.id,
                title: values.title,
                url: values.url,
                showThumbnail: values.showThumbnail,
            })
        }
        revalidatePath('/profile/customize')
    } catch {
        return 'An error occurred while saving the link.'
    }
}

export async function deleteUserLink(linkId: string) {
    await db.delete(userLinks).where(eq(userLinks.id, linkId))
    revalidatePath('/profile/customize')
}

export async function updateUsernameAndBio(formData: FormData) {
    try {
        const session = await auth()
        if (!session?.user) return 'Unauthenticated'
        const validation = z
            .object({
                username: z
                    .string()
                    .max(25, {
                        message: 'Username must be 25 characters or less',
                    })
                    .min(1, { message: 'Username is required' }),
                bio: z
                    .string()
                    .max(150, { message: 'Bio must be 150 characters or less' })
                    .optional(),
            })
            .safeParse({
                username: formData.get('username'),
                bio: formData.get('bio'),
            })
        if (validation.error) return validation.error.issues[0].message

        const { username, bio } = validation.data
        const existingUser = await db.query.users.findFirst({
            where: eq(users.username, username),
        })
        if (!!existingUser && existingUser.id !== session.user.id)
            return 'Username already exists'

        await db
            .update(users)
            .set({ bio, username })
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
    type: 'youtube' | 'instagram' | 'x' | 'tiktok'
) {
    try {
        const session = await auth()
        if (!session?.user) return 'Unauthenticated'
        const userAccountLinks = await db.query.accountLinks.findMany({
            where: eq(accountLinks.userId, session.user.id),
        })
        const tiktokAccountLinkIndex = userAccountLinks.findIndex(
            (accountLink) => accountLink.type === type
        )
        const typeTitleCase = type.charAt(0).toUpperCase() + type.slice(1)
        if (tiktokAccountLinkIndex !== -1) {
            return `You already have a ${typeTitleCase} account linked`
        }
        await db.insert(accountLinks).values({
            userId: session.user.id,
            type,
        })
        revalidatePath('/profile/customize')
    } catch {
        return 'Error adding integration'
    }
}

export async function deleteIntegration(id: string) {
    try {
        const session = await auth()
        if (!session?.user) return 'Unauthenticated'

        await db.delete(accountLinks).where(eq(accountLinks.id, id))
        revalidatePath('/profile/customize')
    } catch {
        return 'Error deleting integration'
    }
}
