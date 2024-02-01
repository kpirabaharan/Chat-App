import { NextResponse } from 'next/server';

import { db } from '@/db';

export const GET = async (req: Request) => {
  try {
    const newMessages = await db.query.message.findMany({});

    return NextResponse.json({ newMessages, status: 200 });
  } catch (err) {
    console.log(err);
    return new NextResponse('Internal error', { status: 500 });
  }
};
