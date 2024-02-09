import { db } from '@/db';
import { directMessage } from '@/db/schema';
import { DirectMessageWithConversationAndUser } from '@/db/types';
import { getSelf } from '@/lib/auth-service';
import { desc, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

const MESSAGES_BATCH = 10;

export const GET = async (req: Request) => {
  const self = await getSelf();
  const { searchParams } = new URL(req.url);

  const cursor = searchParams.get('cursor');
  const conversationId = searchParams.get('conversationId');

  if (!self) {
    return new Response('User not found', { status: 401 });
  }
  if (!conversationId) {
    return new Response('Conversation Id missing', { status: 400 });
  }

  let messages: DirectMessageWithConversationAndUser[] = [];
  let nextCursor: number | null = null;

  if (cursor) {
    const offset = parseInt(cursor, 10);
    messages = await db.query.directMessage.findMany({
      where: eq(directMessage.conversationId, conversationId),
      limit: MESSAGES_BATCH,
      offset,
      with: { conversation: true, sender: true },
      orderBy: [desc(directMessage.createdAt)],
    });

    nextCursor =
      messages.length === MESSAGES_BATCH ? offset + MESSAGES_BATCH : null;
  } else {
    messages = await db.query.directMessage.findMany({
      where: eq(directMessage.conversationId, conversationId),
      limit: MESSAGES_BATCH,
      with: { conversation: true, sender: true },
      orderBy: [desc(directMessage.createdAt)],
    });

    nextCursor = MESSAGES_BATCH;
  }

  // if (messages.length === MESSAGES_BATCH) {
  //   nextCursor = cursor
  //     ? parseInt(cursor, 10) + MESSAGES_BATCH
  //     : MESSAGES_BATCH;
  // }

  return NextResponse.json({
    items: messages,
    nextCursor,
  });
};
