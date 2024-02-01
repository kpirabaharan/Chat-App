import { db } from '@/db';

export const getMessages = async () => {
  const messages = await db.query.message.findMany({ with: { sender: true } });

  if (!messages) {
    return null;
  }

  return messages;
};
