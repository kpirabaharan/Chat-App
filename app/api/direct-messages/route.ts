import { db } from '@/db';
import { conversation, directMessage } from '@/db/schema';
import { DirectMessage } from '@/db/types';
import { getSelf } from '@/lib/auth-service';
import { desc, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

const MESSAGES_BATCH = 1;

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

  let messages = [];

  console.log({ cursor });

  if (cursor) {
    messages = await db.query.directMessage.findMany({
      where: eq(directMessage.conversationId, conversationId),
      limit: MESSAGES_BATCH,
      offset: 1,
      with: { conversation: true, sender: true },
      orderBy: [desc(directMessage.createdAt)],
    });
  } else {
    messages = await db.query.directMessage.findMany({
      where: eq(directMessage.conversationId, conversationId),
      limit: MESSAGES_BATCH,
      with: { conversation: true, sender: true },
      orderBy: [desc(directMessage.createdAt)],
    });
  }

  let nextCursor = null;

  if (messages.length === MESSAGES_BATCH){
    nextCursor = cursor ? cursor + MESSAGES_BATCH : MESSAGES_BATCH;
  }

  return NextResponse.json({
    items: messages,
    nextCursor
  });
};
