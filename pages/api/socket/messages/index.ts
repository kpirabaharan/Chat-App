import { eq } from 'drizzle-orm';
import { NextApiRequest } from 'next';

import { db } from '@/db';
import { message, user } from '@/db/schema';
import { getSelfPages } from '@/lib/auth-service-pages';
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
    // GET USER
    const profile = await getSelfPages(req);

    // GET REQUEST BODY AND QUERY
    const { senderId, insertMessage }: ReqBody = req.body;
    const { groupId } = req.query;

    console.log({ groupId, senderId, insertMessage });

    // VALIDATE REQUEST
    if (!senderId) {
      return res.status(400).json({ error: 'Stream Id missing' });
    }
    if (!insertMessage) {
      return res.status(400).json({ error: 'Message missing' });
    }
    if (!groupId) {
      return res.status(400).json({ error: 'Group Id missing' });
    }

    // VALIDATE USER
    // const sender = await db.query.user.findFirst({
    //   where: eq(user.id, senderId),
    //   columns: { id: true },
    // });

    // if (!sender) {
    //   return res.status(404).json({ error: 'Sender not found' });
    // }

    // INSERT MESSAGE

    // EMIT MESSAGE
    // const event = 'chat';
    // res.socket.server.io.emit(event, newMessage);

    return res.status(200).json({ message: 'Message sent' });
  } catch (err) {
    console.log('MESSAGE ERROR:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
