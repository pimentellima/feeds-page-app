import * as z from 'zod'
export const profileSchema = z.object({
    name: z
        .string()
        .max(40, {
            message: 'Name must be 40 characters or less',
        })
        .min(1, { message: 'Name is required' }),
    bio: z
        .string()
        .max(150, { message: 'Bio must be 150 characters or less' })
        .optional(),
    username: z.string().max(20, {
        message: 'Username must be 20 characters or less',
    }),
})

export type ProfileValues = z.infer<typeof profileSchema>
