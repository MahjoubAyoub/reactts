"use client";

import { useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const useSocket = (editorId: string) => {
  const initSocket = useCallback(() => {
    if (!socket) {
      socket = io(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000', {
        path: '/api/socket',
        addTrailingSlash: false,
      });
    }
    return socket;
  }, []);

  useEffect(() => {
    const socket = initSocket();
    
    if (editorId) {
      socket.emit('join-editor', editorId);
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [editorId, initSocket]);

  const emitElementUpdate = useCallback((elementData: any) => {
    if (socket) {
      socket.emit('element-update', { editorId, elementData });
    }
  }, [editorId]);

  const subscribeToElementUpdates = useCallback((callback: (data: any) => void) => {
    if (socket) {
      socket.on('element-updated', callback);
      return () => {
        if (socket) {
          socket.off('element-updated', callback);
        }
      };
    }
    return () => {};
  }, []);

  return {
    emitElementUpdate,
    subscribeToElementUpdates,
  };
};