import { and, eq, inArray, ne, notInArray, or } from 'drizzle-orm';

import { db } from '@/db';
import { conversation, user } from '@/db/schema';
import { User } from '@/db/types';
import { getSelf } from './auth-service';

export const getUsersWithConversations = async () => {
  const self = await getSelf();

  const usersWithConversations: User[] = await db.query.user.findMany({
    where: or(
      inArray(
        user.id,
        db
          .select({ id: conversation.receiverId })
          .from(conversation)
          .where(eq(conversation.initiatorId, self.id)),
      ),
      inArray(
        user.id,
        db
          .select({ id: conversation.initiatorId })
          .from(conversation)
          .where(eq(conversation.receiverId, self.id)),
      ),
    ),
    with: { conversationsInitiated: true, conversationsReceived: true },
  });

  return usersWithConversations;
};

export const getUsersWithoutConversations = async () => {
  const self = await getSelf();

  const usersWithoutConversations = await db.query.user.findMany({
    where: and(
      ne(user.id, self.id),
      notInArray(
        user.id,
        db
          .select({ id: conversation.receiverId })
          .from(conversation)
          .where(eq(conversation.initiatorId, self.id)),
      ),
      notInArray(
        user.id,
        db
          .select({ id: conversation.initiatorId })
          .from(conversation)
          .where(eq(conversation.receiverId, self.id)),
      ),
    ),
  });

  return usersWithoutConversations;
};
