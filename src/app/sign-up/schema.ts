import * as z from 'zod'

export const schema = z.object({
    email: z.string().email(),
    password: z
        .string()
        .min(8, { message: 'Password must contain at least 8 character(s)' }),
})

export type FormValues = z.infer<typeof schema>
