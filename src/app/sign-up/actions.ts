'use server'
import { db } from '@/drizzle/index'
import { users } from '@/drizzle/schema'
import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { FormValues, schema } from './schema'

export async function signup(values: FormValues) {
    try {
        const validation = schema.safeParse(values)
        if (validation.error) {
            return 'Error validating form values.'
        }
        const { email, password } = validation.data
        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email),
        })

        if (existingUser) return 'User already exists.'

        const hashedPassword = await bcrypt.hash(password, 10)

        await db.insert(users).values({
            email,
            password: hashedPassword,
        })
    } catch {
        return 'An error occurred while signing up.'
    }
}
