import { getAuth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { NextApiRequest } from 'next';

import { db } from '@/db';
import { user } from '@/db/schema';

export const getSelfPages = async (req: NextApiRequest) => {
  const { userId } = getAuth(req);

  if (!userId) {
    throw new Error('User not found');
  }

  const self = await db.query.user.findFirst({
    where: eq(user.externalId, userId),
  });

  if (!self) {
    throw new Error('User not found');
  }

  return self;
};
