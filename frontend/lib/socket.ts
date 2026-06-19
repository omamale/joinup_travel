import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/stores/authStore';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket || !socket.connected) {
    const token = useAuthStore.getState().accessToken;
    socket = io(`${process.env.NEXT_PUBLIC_WS_URL}/chat`, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => console.log('Socket connected:', socket?.id));
    socket.on('disconnect', (reason) => console.log('Socket disconnected:', reason));
    socket.on('connect_error', (err) => console.error('Socket error:', err.message));
  }
  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}

export function joinConversation(conversationId: string) {
  getSocket().emit('conversation:join', { conversationId });
}

export function leaveConversation(conversationId: string) {
  getSocket().emit('conversation:leave', { conversationId });
}

export function sendMessage(conversationId: string, content: string, type = 'TEXT') {
  return new Promise((resolve) => {
    getSocket().emit('message:send', { conversationId, content, type }, resolve);
  });
}

export function emitTyping(conversationId: string) {
  getSocket().emit('user:typing', { conversationId });
}

export function emitStopTyping(conversationId: string) {
  getSocket().emit('user:stop-typing', { conversationId });
}

export function emitSOS(lat: number, lng: number, tripId?: string) {
  getSocket().emit('sos:alert', { lat, lng, tripId });
}

export function shareLocation(tripId: string, lat: number, lng: number) {
  getSocket().emit('location:share', { tripId, lat, lng });
}
