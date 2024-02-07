import { InferSelectModel } from 'drizzle-orm';

import {
  conversation,
  directMessage,
  group,
  message,
  user,
  usersToGroups,
} from '@/db/schema';

export type Conversation = InferSelectModel<typeof conversation>;

export type DirectMessage = InferSelectModel<typeof directMessage>;

export type Group = InferSelectModel<typeof group>;

export type Message = InferSelectModel<typeof message>;

export type User = InferSelectModel<typeof user>;

export type UsersToGroups = InferSelectModel<typeof usersToGroups>;

export type ConversationWithUsers = Conversation & {
  initiator?: User;
  receiver?: User;
};

export type DirectMessageWithConversationAndUser = DirectMessage & {
  conversation: Conversation;
  sender: User;
};
