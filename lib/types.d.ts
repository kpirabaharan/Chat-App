import { Server as NetServer, Socket } from 'net';
import { NextApiResponse } from 'next';
import { Server as SocketIOServer } from 'socket.io';
import * as z from 'zod';

export const messageSchema = z.object({
  message: z.string().nonempty(),
});

export type MessageFormValues = z.infer<typeof messageSchema>;

export type ParamKey = 'groupId' | 'conversationId' | null;

export type MessageType = 'all' | 'group' | 'direct';

export type NextApiResponseServerIO = NextApiResponse & {
  socket: Socket & { server: NetServer & { io: SocketIOServer } };
};
