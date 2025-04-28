import { Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { Socket } from 'socket.io';
import { NextApiResponse } from 'next';

export type NextApiResponseWithSocket = NextApiResponse & {
  socket: any;
};

interface ElementData {
  editorId: string;
  elementData: any;
}

export const initSocket = (server: HttpServer) => {
  const io = new SocketIOServer(server, {
    path: '/api/socket',
    addTrailingSlash: false,
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket: Socket) => {
    console.log('Client connected:', socket.id);

    socket.on('join-editor', (editorId: string) => {
      socket.join(`editor-${editorId}`);
    });

    socket.on('element-update', ({ editorId, elementData }: ElementData) => {
      socket.to(`editor-${editorId}`).emit('element-updated', elementData);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
};