import { InferSelectModel } from 'drizzle-orm';

import { message, users } from '@/db/schema';

export type User = InferSelectModel<typeof users>;

export type Message = InferSelectModel<typeof message>;

export type MessageWithUser = Message & {
  sender: User;
};
