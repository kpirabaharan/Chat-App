import { WebhookEvent } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { Webhook } from 'svix';

import { db } from '@/db';
import { user } from '@/db/schema';

export const POST = async (req: Request) => {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env');
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);
  let event: WebhookEvent;

  // Verify the payload with the headers
  try {
    event = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400,
    });
  }

  // Event Type
  const eventType = event.type;

  // Handle the event for type user
  switch (eventType) {
    case 'user.created': {
      const externalId = event.data.id;
      const username = event.data.username!;
      const imageUrl = event.data.image_url;

      const [createdUser] = await db
        .insert(user)
        .values({
          username,
          externalId,
          imageUrl,
        })
        .returning();

      console.log({ clerk_webhook: `[USER_CREATED]: ${createdUser.username}` });

      break;
    }
    case 'user.updated': {
      const externalId = event.data.id;
      const username = event.data.username!;
      const imageUrl = event.data.image_url;

      const [updatedUser] = await db
        .update(user)
        .set({ externalId, username, imageUrl })
        .where(eq(user.externalId, externalId))
        .returning();

      console.log({ clerk_webhook: `[USER_UPDATED]: ${updatedUser.username}` });

      break;
    }
    case 'user.deleted': {
      const externalId = event.data.id!;

      const [deletedUser] = await db
        .delete(user)
        .where(eq(user.externalId, externalId))
        .returning();

      console.log({ clerk_webhook: `[USER_DELETED]: ${deletedUser.username}` });

      break;
    }
  }

  return NextResponse.json({ message: 'Webhook received' }, { status: 200 });
};
