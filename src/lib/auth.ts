import {
    GetServerSidePropsContext,
    NextApiRequest,
    NextApiResponse,
} from 'next'
import { AuthOptions } from 'next-auth'
import { getServerSession } from 'next-auth/next'
import GoogleProvider from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import * as z from 'zod'
import { eq } from 'drizzle-orm'
import { users } from '@/drizzle/schema'
import bcrypt from 'bcryptjs'
import { ACCESS_TOKEN_TTL } from '@/constants'
import { obtainAccessToken, refreshAccessToken } from '@/services/tokens'
import { db } from '@/drizzle/index'

export const authOptions = {
    secret: process.env.NEXT_AUTH_SECRET,
    pages: {
        signIn: '/sign-in',
        newUser: '/sign-up',
    },
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async signIn({ user }) {
            if (!user.email) return true
            const existingUser = await db.query.users.findFirst({
                where: eq(users.email, user.email),
            })
            if (existingUser) {
                user.id = existingUser.id
                return true
            }
            const [newUser] = await db
                .insert(users)
                .values({ email: user.email })
                .returning()
            user.id = newUser.id
            return true
        },
        async jwt({ token, user, account }) {
            if (user) {
                token.refreshToken = await obtainAccessToken(
                    token.sub as string
                )
                token.expiresAt = new Date(Date.now() + ACCESS_TOKEN_TTL)
            }

            const expiresAt = token.expiresAt as Date

            if (new Date() < new Date(expiresAt)) {
                return token
            }

            return await refreshAccessToken(token as any)
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.sub as string
                session.user.name = token.name
                session.user.email = token.email
            }

            return session
        },
    },
    providers: [
        Credentials({
            name: 'Credentials',
            credentials: {
                email: {
                    label: 'Email',
                    type: 'text',
                },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({
                        email: z.string().email(),
                        password: z.string().min(6),
                    })
                    .safeParse(credentials)

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data
                    const user = await db.query.users.findFirst({
                        where: eq(users.email, email),
                    })

                    if (!user || !user.password) return null
                    const passwordsMatch = await bcrypt.compare(
                        password,
                        user.password
                    )

                    if (passwordsMatch)
                        return {
                            id: user.id,
                        }
                }

                return null
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
} satisfies AuthOptions

export function auth(
    ...args:
        | [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']]
        | [NextApiRequest, NextApiResponse]
        | []
) {
    return getServerSession(...args, authOptions)
}
