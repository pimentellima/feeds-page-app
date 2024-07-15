'use server'
import { db } from '@/drizzle/index'
import { userLinks, users } from '@/drizzle/schema'
import { auth } from '@/lib/auth'
import { linkSchema, LinkValues } from './add-link-schema'
import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'
import * as z from 'zod'
import { utapi } from '@/server/uploadthing'
import { FileEsque, UploadFileResult } from 'uploadthing/types'
import { themes } from '@/constants'

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

export async function changeUserBio(formData: FormData) {
    try {
        const valiation = z.string().safeParse(formData.get('bio'))
        if (valiation.error) return 'Error validating form values.'
        const session = await auth()
        if (!session?.user) return 'Unauthenticated'

        await db
            .update(users)
            .set({ bio: valiation.data })
            .where(eq(users.id, session.user.id))
        revalidatePath('/profile/customize')
    } catch {
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
