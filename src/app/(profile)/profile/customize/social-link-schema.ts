import * as z from 'zod'
export const schema = z.object({
    type: z.enum(['tiktok', 'instagram', 'x', 'linkedin', 'github', 'youtube']),
    url: z.string().url(),
})
export type SocialLinkValues = z.infer<typeof schema>
