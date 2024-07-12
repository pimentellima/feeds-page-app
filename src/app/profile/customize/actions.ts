'use server'
import { db } from '@/drizzle/index'
import { userLinks } from '@/drizzle/schema'
import { auth } from '@/lib/auth'
import { linkSchema, LinkValues } from './add-link-schema'
import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'

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
                    showThumbnail: values.showThumbnail
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
