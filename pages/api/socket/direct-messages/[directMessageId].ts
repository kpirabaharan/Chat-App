import { eq } from 'drizzle-orm';
import { NextApiRequest } from 'next';

import { db } from '@/db';
import { conversation, directMessage } from '@/db/schema';
import { getSelfPages } from '@/lib/auth-service-pages';
import { NextApiResponseServerIO } from '@/lib/types.d';

interface ReqBody {
  message: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO,
) {
  if (req.method !== 'DELETE' && req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // GET USER
    const self = await getSelfPages(req);

    // GET REQUEST BODY AND QUERY
    const { message }: ReqBody = req.body;
    const { directMessageId, conversationId } = req.query;

    // VALIDATE REQUEST
    if (!self) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    if (!message && req.method === 'PATCH') {
      return res.status(400).json({ error: 'Message missing' });
    }
    if (!conversationId) {
      return res.status(400).json({ error: 'Conversation Id missing' });
    }
    if (!directMessageId) {
      return res.status(400).json({ error: 'Direct Message Id missing' });
    }

    // VALIDATE CONVERSATION
    const existingConversation = await db.query.conversation.findFirst({
      where: eq(conversation.id, conversationId as string),
      with: {
        initiator: true,
        receiver: true,
      },
    });

    if (!existingConversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const messageToUpdate = await db.query.directMessage.findFirst({
      where: eq(directMessage.id, directMessageId as string),
    });
    if (!messageToUpdate || messageToUpdate.deleted) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // UPDATE OR DELETE MESSAGE
    if (req.method === 'DELETE' && self.id === messageToUpdate.userId) {
      await db
        .update(directMessage)
        .set({
          deleted: true,
          edited: false,
          content: 'Message deleted',
        })
        .where(eq(directMessage.id, messageToUpdate.id))
        .execute();
    } else if (req.method === 'PATCH' && self.id === messageToUpdate.userId) {
      await db
        .update(directMessage)
        .set({
          content: message,
          edited: true,
        })
        .where(eq(directMessage.id, messageToUpdate.id))
        .execute();
    }

    const updatedMessage = await db.query.directMessage.findFirst({
      where: eq(directMessage.id, messageToUpdate.id),
      with: {
        conversation: true,
        sender: true,
      },
    });

    if (!updatedMessage) {
      return res.status(500).json({ error: 'Message coud not be updated.' });
    }

    // EMIT MESSAGE
    const event = `chat:${updatedMessage?.conversationId}:update-message`;
    res.socket.server.io.emit(event, updatedMessage);

    return res.status(200).json(updatedMessage);
  } catch (err: any) {
    console.log('UPDATE_MESSAGE_ERROR:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
