import { currentUser } from '@clerk/nextjs';
import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { users } from '@/db/schema';

export const getSelf = async () => {
  const self = await currentUser();

  if (!self || !self.username) {
    throw new Error('User not found');
  }

  const user = await db.query.users.findFirst({
    where: eq(users.externalId, self.id),
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};
