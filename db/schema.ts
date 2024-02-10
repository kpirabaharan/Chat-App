import { relations } from 'drizzle-orm';
import {
  boolean,
  index,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

export const user = pgTable(
  'user',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    username: text('user_name').unique().notNull(),
    imageUrl: text('image_url').notNull(),
    externalId: text('external_id').unique().notNull(),
    isOnline: boolean('is_online').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  t => {
    return {
      externalIdIndex: index('external_id_index').on(t.externalId),
    };
  },
);

export const userRelations = relations(user, ({ many }) => ({
  conversationsInitiated: many(conversation, {
    relationName: 'conversationsInitiated',
  }),
  conversationsReceived: many(conversation, {
    relationName: 'conversationsReceived',
  }),
  directMessages: many(directMessage),
  usersToGroups: many(usersToGroups),
  messages: many(message),
}));

export const conversation = pgTable(
  'conversation',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    initiatorId: uuid('initiator_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    receiverId: uuid('receiver_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  t => {
    return {
      userOneIndex: index('initiator_index').on(t.initiatorId),
      userTwoIndex: index('receiver_index').on(t.receiverId),
    };
  },
);

// TODO: Change receiver to recipient
export const conversationRelations = relations(
  conversation,
  ({ one, many }) => ({
    initiator: one(user, {
      fields: [conversation.initiatorId],
      references: [user.id],
      relationName: 'conversationsInitiated',
    }),
    receiver: one(user, {
      fields: [conversation.receiverId],
      references: [user.id],
      relationName: 'conversationsReceived',
    }),
    directMessages: many(directMessage),
  }),
);

export const directMessage = pgTable('direct_message', {
  id: uuid('id').defaultRandom().primaryKey(),
  content: text('content').notNull(),
  edited: boolean('edited').default(false).notNull(),
  deleted: boolean('deleted').default(false).notNull(),
  conversationId: uuid('conversation_id')
    .notNull()
    .references(() => conversation.id, { onDelete: 'cascade' }),
  userId: uuid('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const directMessageRelations = relations(directMessage, ({ one }) => ({
  conversation: one(conversation, {
    fields: [directMessage.conversationId],
    references: [conversation.id],
  }),
  sender: one(user, {
    fields: [directMessage.userId],
    references: [user.id],
  }),
}));

export const group = pgTable('group', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const groupRelations = relations(group, ({ one, many }) => ({
  messages: many(message),
  usersToGroups: many(usersToGroups),
}));

export const usersToGroups = pgTable(
  'users_to_groups',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => user.id),
    groupId: uuid('group_id')
      .notNull()
      .references(() => group.id),
  },
  t => ({
    pk: primaryKey({ columns: [t.userId, t.groupId] }),
  }),
);

export const usersToGroupsRelations = relations(usersToGroups, ({ one }) => ({
  user: one(user, {
    fields: [usersToGroups.userId],
    references: [user.id],
  }),
  group: one(group, {
    fields: [usersToGroups.groupId],
    references: [group.id],
  }),
}));

export const message = pgTable('message', {
  id: uuid('id').defaultRandom().primaryKey(),
  content: text('content').notNull(),
  deleted: boolean('deleted').default(false).notNull(),
  groupId: uuid('group_id')
    .notNull()
    .references(() => group.id, { onDelete: 'cascade' }),
  userId: uuid('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const messageRelations = relations(message, ({ one }) => ({
  group: one(group, {
    fields: [message.groupId],
    references: [group.id],
  }),
  sender: one(user, {
    fields: [message.userId],
    references: [user.id],
  }),
}));
