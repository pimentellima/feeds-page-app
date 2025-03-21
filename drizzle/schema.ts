import { relations, sql } from 'drizzle-orm'
import {
    boolean,
    integer,
    pgEnum,
    pgTable,
    serial,
    text,
    timestamp,
    uniqueIndex,
} from 'drizzle-orm/pg-core'

export const layoutEnum = pgEnum('layouEnum', [
    'grid1x1',
    'grid2x2',
    'grid3x3',
    'list',
])

export const users = pgTable('users', {
    id: text('id')
        .notNull()
        .default(sql`gen_random_uuid()`)
        .primaryKey(),
    name: text('name'),
    username: text('username'),
    bio: text('bio'),
    layout: layoutEnum('layout').default('grid2x2'),
    theme: text('theme'),
    email: text('email'),
    password: text('password'),
    createdAt: timestamp('created_at').defaultNow(),
    imageUrl: text('imageUrl'),
})

export const socialLinksEnum = pgEnum('socialLinksEnum', [
    'tiktok',
    'instagram',
    'x',
    'linkedin',
    'github',
    'youtube',
    'twitch',
    'facebook',
    'website',
])

export const integrationTypeEnum = pgEnum('integrationType', [
    'tiktokIntegration',
    'instagramIntegration',
    'xIntegration',
    'youtubeIntegration',
    'spotifyIntegration',
    'pinterestIntegration',
    'twitchIntegration',
])

export const promoCodes = pgTable('promoCodes', {
    id: text('id')
        .default(sql`gen_random_uuid()`)
        .primaryKey(),
    code: text('code').default(sql`gen_random_uuid()`),
    valid: boolean('valid').default(true),
})

export const socialLinks = pgTable('socialLinks', {
    id: text('id')
        .default(sql`gen_random_uuid()`)
        .primaryKey(),
    type: socialLinksEnum('type').notNull(),
    url: text('url').notNull(),
    userId: text('userId')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
})

export const widgets = pgTable('widgets', {
    id: text('id')
        .default(sql`gen_random_uuid()`)
        .primaryKey(),
    userId: text('userId')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    type: integrationTypeEnum('type'),
    pos: serial('pos').notNull(),
})

export const integrationTokens = pgTable(
    'integrationTokens',
    {
        id: text('id')
            .default(sql`gen_random_uuid()`)
            .primaryKey(),
        accessToken: text('accessToken').notNull(),
        expiresAt: timestamp('expiresAt', {
            mode: 'date',
        }),
        userId: text('userId')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        type: integrationTypeEnum('type').notNull(),
        refreshToken: text('refreshToken'),
        refreshExpiresAt: timestamp('refreshExpiresAt', {
            mode: 'date',
        }),
    },
    (table) => ({
        uniqueUserType: uniqueIndex('uniqueUserType').on(
            table.userId,
            table.type
        ),
    })
)

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

export const subscriptions = pgTable('subscriptions', {
    id: text('id')
        .default(sql`gen_random_uuid()`)
        .primaryKey(),
    userId: text('userId')
        .references(() => users.id, { onDelete: 'cascade' })
        .unique()
        .notNull(),
    createdAt: timestamp('created_at').defaultNow(),
})

export const integrationTokenRelations = relations(
    integrationTokens,
    ({ one }) => ({
        user: one(users, {
            fields: [integrationTokens.userId],
            references: [users.id],
        }),
    })
)

export const socialLinkRelations = relations(socialLinks, ({ one }) => ({
    user: one(users, {
        fields: [socialLinks.userId],
        references: [users.id],
    }),
}))

export const usersRelations = relations(users, ({ many, one }) => ({
    widgets: many(widgets),
    integrationTokens: many(integrationTokens),
    socialLinks: many(socialLinks),
}))

export const widgetRelations = relations(widgets, ({ one }) => ({
    user: one(users, {
        fields: [widgets.userId],
        references: [users.id],
    }),
}))
