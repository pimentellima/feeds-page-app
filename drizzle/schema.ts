import { relations, sql } from 'drizzle-orm'
import {
    boolean,
    numeric,
    pgEnum,
    pgTable,
    serial,
    text,
    timestamp,
    integer,
} from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
    id: text('id')
        .notNull()
        .default(sql`gen_random_uuid()`)
        .primaryKey(),
    name: text('name'),
    username: text('username'),
    bio: text('bio'),
    theme: text('theme'),
    email: text('email'),
    password: text('password'),
    instagramAccessToken: text('instagramAccessToken'),
    createdAt: timestamp('created_at').defaultNow(),
    imageUrl: text('imageUrl'),
})
export const accountLinkTypeEnum = pgEnum('accountLinkType', [
    'tiktok',
    'instagram',
    'x',
])

export const accountLinks = pgTable('accountLinks', {
    id: text('id')
        .default(sql`gen_random_uuid()`)
        .primaryKey(),
    userId: text('userId')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    type: accountLinkTypeEnum('type').notNull(),
    accessToken: text('accessToken').notNull(),
    expiresIn: integer('expiresIn').notNull(),
    refreshToken: text('refreshToken'),
    refresh_expires_in: integer('refresh_expiresIn'),
})

export const userLinks = pgTable('userLinks', {
    id: text('id')
        .default(sql`gen_random_uuid()`)
        .primaryKey(),
    userId: text('userId')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    showThumbnail: boolean('showThumbnail'),
    url: text('url').notNull(),
})

export const refreshTokens = pgTable('refreshTokens', {
    token: text('token')
        .notNull()
        .default(sql`gen_random_uuid()`)
        .primaryKey(),
    userId: text('userId')
        .references(() => users.id, { onDelete: 'cascade' })
        .notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
})

export const usersRelations = relations(users, ({ many }) => ({
    links: many(userLinks),
    accountLinks: many(accountLinks),
}))

export const userLinksRelations = relations(userLinks, ({ one }) => ({
    user: one(users, {
        fields: [userLinks.userId],
        references: [users.id],
    }),
}))

export const accountLinksRelations = relations(accountLinks, ({ one }) => ({
    user: one(users, {
        fields: [accountLinks.userId],
        references: [users.id],
    }),
}))
