import { currentUser } from '@clerk/nextjs';
import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { user } from '@/db/schema';
import { redirect } from 'next/navigation';

export const getSelf = async () => {
  const cu = await currentUser();

  if (!cu || !cu.username) {
    throw new Error('User not found');
  }

  const self = await db.query.user.findFirst({
    where: eq(user.externalId, cu.id),
  });

  if (!self) {
    throw new Error('User not found');
  }

  return self;
};
