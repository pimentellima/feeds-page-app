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

export const users = pgTable('users', {
    id: text('id')
        .notNull()
        .default(sql`gen_random_uuid()`)
        .primaryKey(),
    name: text('name'),
    username: text('username'),
    location: text('location'),
    bio: text('bio'),
    gridSize: integer('gridSize').default(2),
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
])

export const integrationTypeEnum = pgEnum('integrationType', [
    'tiktokIntegration',
    'instagramIntegration',
    'xIntegration',
    'youtubeIntegration',
])

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

export const widgets = pgTable(
    'widgets',
    {
        id: text('id')
            .default(sql`gen_random_uuid()`)
            .primaryKey(),
        userId: text('userId')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        type: integrationTypeEnum('type'),
        pos: serial('pos').notNull(),
    },
    (widget) => ({
        uniqueWidgetPos: uniqueIndex('uniqueWidgetPos').on(
            widget.userId,
            widget.pos
        ),
    })
)

export const integrationTokens = pgTable('integrationTokens', {
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

export const usersRelations = relations(users, ({ many }) => ({
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
