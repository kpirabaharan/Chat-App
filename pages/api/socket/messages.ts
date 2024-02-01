import { eq } from 'drizzle-orm';
import { NextApiRequest } from 'next';

import { db } from '@/db';
import { message, users } from '@/db/schema';
import { NextApiResponseServerIO } from '@/lib/types.d';

interface ReqBody {
  senderId: string;
  insertMessage: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { senderId, insertMessage }: ReqBody = req.body;

    console.log('Here is the request body:', req.body);

    // VALIDATE REQUEST
    if (!senderId) {
      return res.status(400).json({ error: 'Stream Id missing' });
    }
    if (!insertMessage) {
      return res.status(400).json({ error: 'Message missing' });
    }

    // VALIDATE USER
    const sender = await db.query.users.findFirst({
      where: eq(users.id, senderId),
      columns: { id: true },
    });

    if (!sender) {
      return res.status(404).json({ error: 'Sender not found' });
    }

    // INSERT MESSAGE
    const newMessage = await db.insert(message).values({
      userId: senderId,
      message: insertMessage,
    });

    // EMIT MESSAGE
    const event = 'chat';
    res.socket.server.io.emit(event, newMessage);

    return res.status(200).json({ message: 'Message sent' });
  } catch (err) {
    console.log('MESSAGE ERROR:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
