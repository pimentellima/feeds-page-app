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
    bio: text('bio'),
    theme: text('theme'),
    email: text('email'),
    password: text('password'),
    createdAt: timestamp('created_at').defaultNow(),
    imageUrl: text('imageUrl'),
})
export const accountLinkTypeEnum = pgEnum('accountLinkType', [
    'tiktok',
    'instagram',
    'x',
    'youtube',
])

export const widgetTypeEnum = pgEnum('accountLinkType', [
    'tiktokIntegration',
    'instagramIntegration',
    'xIntegration',
    'youtubeIntegration',
    'socialLink',
])

export const widgets = pgTable(
    'widgets',
    {
        id: text('id')
            .default(sql`gen_random_uuid()`)
            .primaryKey(),
        userId: text('userId')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        type: widgetTypeEnum('type').notNull(),
        pos: serial('pos').notNull(),
        linkId: text('linkId').references(() => links.id, {
            onDelete: 'cascade',
        }),
        integrationTokenId: text('integrationTokenId').references(
            () => integrationTokens.id,
            { onDelete: 'cascade' }
        ),
    },
    (widgets) => ({
        userWidgetTypeIndex: uniqueIndex('userWidgetTypeIndex').on(
            widgets.userId,
            widgets.type
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
    refreshToken: text('refreshToken'),
    refreshExpiresAt: timestamp('refreshExpiresAt', {
        mode: 'date',
    }),
})

export const links = pgTable('links', {
    id: text('id')
        .default(sql`gen_random_uuid()`)
        .primaryKey(),
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
    widgets: many(widgets),
}))

export const widgetRelations = relations(widgets, ({ one }) => ({
    user: one(users, {
        fields: [widgets.userId],
        references: [users.id],
    }),
    link: one(links, {
        fields: [widgets.linkId],
        references: [links.id],
    }),
    integrationToken: one(integrationTokens, {
        fields: [widgets.integrationTokenId],
        references: [integrationTokens.id],
    }),
}))
