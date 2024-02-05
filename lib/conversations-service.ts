import { desc, eq, or } from 'drizzle-orm';
import { orderBy } from 'lodash';

import { db } from '@/db';
import { conversation } from '@/db/schema';
import { getSelf } from './auth-service';

export const getConversationsWithUsers = async () => {
  const self = await getSelf();

  const cI = await db.query.conversation.findMany({
    where: or(eq(conversation.initiatorId, self.id)),
    with: { receiver: true },
    orderBy: [desc(conversation.createdAt)],
  });

  const conversationsInitiated = cI.map(c => {
    return {
      id: c.id,
      user: c.receiver,
      createdAt: c.createdAt,
    };
  });

  const cR = await db.query.conversation.findMany({
    where: or(eq(conversation.receiverId, self.id)),
    with: { initiator: true },
    orderBy: [desc(conversation.createdAt)],
  });

  const conversationsReceived = cR.map(c => {
    return {
      id: c.id,
      user: c.initiator,
      createdAt: c.createdAt,
    };
  });

  const conversations = orderBy(
    conversationsInitiated.concat(conversationsReceived),
    ['createdAt'],
    ['desc'],
  );

  return conversations;
};

export const getConversationById = async (id: string) => {
  const self = await getSelf();

  const selectedConversation = await db.query.conversation.findFirst({
    where: eq(conversation.id, id),
    with: { initiator: true, receiver: true },
  });

  if (!selectedConversation) {
    return null;
  }

  if (
    selectedConversation.initiatorId !== self.id &&
    selectedConversation.receiverId !== self.id
  ) {
    return null;
  }

  return selectedConversation;
};
