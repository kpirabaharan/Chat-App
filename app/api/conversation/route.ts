import { NextResponse } from 'next/server';

import { db } from '@/db';
import { conversation, user } from '@/db/schema';
import { getSelf } from '@/lib/auth-service';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

interface ReqBody {
  receiverId: string;
}

export async function POST(req: Request) {
  try {
    const self = await getSelf();

    if (!self) {
      return new NextResponse('User not found', { status: 401 });
    }

    const { receiverId }: ReqBody = await req.json();

    if (!receiverId) {
      return new NextResponse('Receiver Id missing', { status: 400 });
    }

    // FIND SENDER
    const initiator = await db.query.user.findFirst({
      where: eq(user.id, self.id),
    });

    if (!initiator) {
      return new NextResponse('Sender not found', { status: 404 });
    }

    // FIND RECEIVER
    const receiver = await db.query.user.findFirst({
      where: eq(user.id, receiverId),
    });

    if (!receiver) {
      return new NextResponse('Receiver not found', { status: 404 });
    }

    // CREATE NEW CONVERSATION
    const [newConversation] = await db
      .insert(conversation)
      .values({
        initiatorId: initiator.id,
        receiverId: receiverId,
      })
      .returning();

    if (newConversation) {
      revalidatePath('/');
      revalidatePath(`/direct-messages/`, 'layout');
      revalidatePath(`/`, 'layout');
    }

    return NextResponse.json(newConversation, { status: 200 });
  } catch (err: any) {
    console.log(err);
    throw new Error(err.message);
  }
}
