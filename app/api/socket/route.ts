import { createServer } from 'http';
import { NextRequest } from 'next/server';
import { initSocket } from '@/lib/socket';

const httpServer = createServer();
const io = initSocket(httpServer);

export async function GET(req: NextRequest) {
  // Handle WebSocket upgrade
  const upgrade = req.headers.get('upgrade');
  if (upgrade?.toLowerCase() !== 'websocket') {
    return new Response('Expected WebSocket connection', { status: 426 });
  }

  try {
    // @ts-ignore - WebSocket handling
    await io.attachWebSocket(req);
    return new Response(null, { status: 101 });
  } catch (e) {
    return new Response('WebSocket upgrade failed', { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
export const runtime = 'edge';