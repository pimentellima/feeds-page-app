'use server'
import { db } from '@/drizzle/index'
import {
    integrationTokens,
    socialLinks,
    users,
    widgets,
} from '@/drizzle/schema'
import { auth } from '@/lib/auth'
import { and, eq, InferInsertModel, ne, sql } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { profileSchema, ProfileValues } from './edit-profile-schema'
import { schema, SocialLinkValues } from './social-link-schema'
import { deleteFile, uploadFile } from '@/lib/gcs'

export async function createSocialLink(values: SocialLinkValues) {
    try {
        const session = await auth()
        if (!session?.user) return 'Unauthenticated'
        const { type, url } = schema.parse(values)

        await db.insert(socialLinks).values({
            userId: session.user.id,
            type,
            url,
        })
        revalidatePath('/profile/customize')
    } catch {
        return 'Error adding link'
    }
}

export async function deleteSocialLink(linkId: string) {
    try {
        const session = await auth()
        if (!session?.user) return 'Unauthenticated'
        await db
            .delete(socialLinks)
            .where(
                and(
                    eq(socialLinks.id, linkId),
                    eq(socialLinks.userId, session.user.id)
                )
            )
        revalidatePath('/profile/customize')
    } catch {
        return 'Error deleting link'
    }
}

export async function updateUserProfile(values: ProfileValues) {
    try {
        const session = await auth()
        if (!session?.user) return 'Unauthenticated'
        const data = profileSchema.parse(values)

        const { name, bio, username, location } = data

        if (username) {
            const existingUsername = await db.query.users.findFirst({
                where: and(
                    eq(users.username, username),
                    ne(users.id, session.user.id)
                ),
            })
            if (!!existingUsername) return 'Username not available'
        }

        await db
            .update(users)
            .set({ bio, name, username, location })
            .where(eq(users.id, session.user.id))
        revalidatePath('/profile/customize')
    } catch (e) {
        console.log(e)
        return 'Internal error'
    }
}

export async function updateUserImage(formData: FormData) {
    const file = formData.get('file')
    if (!(file instanceof File)) {
        throw new Error('Uploaded file is not valid')
    }
    try {
        const session = await auth()
        if (!session?.user) return 'Unauthenticated'
        const newImageUrl = await uploadFile(file)

        const oldImageUrl = (
            await db.query.users.findFirst({
                where: eq(users.id, session.user.id),
                columns: { imageUrl: true },
            })
        )?.imageUrl
        const oldFilename = oldImageUrl?.split('/').pop()
        if (oldFilename) {
            await deleteFile(oldFilename)
        }

        await db
            .update(users)
            .set({ imageUrl: newImageUrl })
            .where(eq(users.id, session.user.id))
        revalidatePath('/profile/customize')
    } catch (e) {
        console.log(e)
        return 'An error occurred'
    }
}

export async function removeUserImage() {
    try {
        const session = await auth()
        if (!session?.user) return 'Unauthenticated'

        const oldImageUrl = (
            await db.query.users.findFirst({
                where: eq(users.id, session.user.id),
                columns: { imageUrl: true },
            })
        )?.imageUrl
        const fileName = oldImageUrl?.split('/').pop()
        if (fileName) {
            await deleteFile(fileName)
        }

        await db
            .update(users)
            .set({ imageUrl: null })
            .where(eq(users.id, session.user.id))
        revalidatePath('/profile/customize')
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
            .set({ theme })
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

interface AdminCodes {
    ISO3166_2: string
}

interface Geoname {
    adminCode1: string
    lng: string
    geonameId: number
    toponymName: string
    countryId: string
    fcl: string
    population: number
    countryCode: string
    name: string
    fclName: string
    adminCodes1: AdminCodes
    countryName: string
    fcodeName: string
    adminName1: string
    lat: string
    fcode: string
}

interface GeoNamesResponse {
    totalResultsCount: number
    geonames: Geoname[]
}

export async function getCityByName(name: string) {
    const res = await fetch(
        `http://api.geonames.org/searchJSON?name=${name}&username=${process.env.GEONAMES_USERNAME}&maxRows=5`
    )
    if (!res.ok) {
        throw new Error('')
    }
    const json = (await res.json()) as GeoNamesResponse
    const uniqueCities = Array.from(
        new Set(
            json.geonames.map(
                (geoname) => `${geoname.name}, ${geoname.countryName}`
            )
        )
    )
    return uniqueCities
}

export async function updateGridSize(gridSize: number) {
    try {
        const session = await auth()
        if (!session?.user) return 'Unauthenticated'
        if (![1, 2, 3].includes(gridSize)) return 'Invalid grid size'

        await db
            .update(users)
            .set({ gridSize })
            .where(eq(users.id, session.user.id))
        revalidatePath('/profile/customize')
    } catch (e) {
        return 'An error occurred'
    }
}

export async function deleteIntegration(integrationId: string) {
    try {
        const session = await auth()
        if (!session?.user) return 'Unauthenticated'

        await db
            .delete(integrationTokens)
            .where(eq(integrationTokens.id, integrationId))
        revalidatePath('/profile/customize')
    } catch {
        return 'Error deleting integration'
    }
}
