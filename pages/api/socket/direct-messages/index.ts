import { eq } from 'drizzle-orm';
import { NextApiRequest } from 'next';

import { db } from '@/db';
import { conversation, directMessage, message, user } from '@/db/schema';
import { getSelfPages } from '@/lib/auth-service-pages';
import { NextApiResponseServerIO } from '@/lib/types.d';

interface ReqBody {
  senderId: string;
  message: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // GET USER
    const self = await getSelfPages(req);

    // GET REQUEST BODY AND QUERY
    const { message }: ReqBody = req.body;
    const { conversationId } = req.query;

    // VALIDATE REQUEST
    if (!self) {
      return res.status(401).json({ error: 'Sender Id missing' });
    }
    if (!message) {
      return res.status(400).json({ error: 'Message missing' });
    }
    if (!conversationId) {
      return res.status(400).json({ error: 'Conversation Id missing' });
    }

    // VALIDATE CONVERSATION
    const existingConversation = await db.query.conversation.findFirst({
      where: eq(conversation.id, conversationId as string),
    });

    if (!existingConversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // INSERT MESSAGE
    const [insertNewMessage] = await db
      .insert(directMessage)
      .values({
        conversationId: conversationId as string,
        content: message,
        userId: self.id,
      })
      .returning();

    const newMessage = await db.query.directMessage.findFirst({
      where: eq(directMessage.id, insertNewMessage.id),
      with: {
        conversation: true,
        sender: true,
      },
    });

    if (!newMessage) {
      return res.status(500).json({ error: 'Message coud not be sent.' });
    }

    // EMIT MESSAGE
    const event = `chat:${newMessage.conversationId}:new-message`;
    res.socket.server.io.emit(event, newMessage);

    return res.status(200).json(newMessage);
  } catch (err) {
    console.log('MESSAGE ERROR:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
