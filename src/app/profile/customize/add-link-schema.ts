import * as z from 'zod'

export const linkSchema = z.object({
    id: z.string().nullable().optional(),
    title: z.string().min(1).max(30),
    url: z.string().url(),
    showThumbnail: z.boolean().nullable(),
})

export type LinkValues = z.infer<typeof linkSchema>
