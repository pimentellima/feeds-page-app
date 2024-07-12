import * as z from 'zod'

export const linkSchema = z.object({
    id: z.string().nullable().optional(),
    title: z.string().min(1).max(25),
    url: z.string().url(),
})

export type LinkValues = z.infer<typeof linkSchema>
