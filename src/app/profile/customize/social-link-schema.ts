import * as z from 'zod'
export const schema = z.object({
    id: z.string().optional().nullable(),
    type: z.enum(['tiktok', 'instagram', 'x', 'linkedin', 'github', 'youtube', 'twitch', 'facebook', 'website']),
    url: z.string().url(),
})
export type SocialLinkValues = z.infer<typeof schema>
