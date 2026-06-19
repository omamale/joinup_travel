'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { ArrowLeft, Send, Image as ImageIcon, MoreVertical } from 'lucide-react';
import Link from 'next/link';
import { chatApi, uploadApi } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { useChatStore } from '@/stores/chatStore';
import { Avatar } from '@/components/ui/Avatar';
import { getSocket, joinConversation, leaveConversation, sendMessage, emitTyping, emitStopTyping } from '@/lib/socket';
import { timeAgo } from '@/lib/utils';
import { Message } from '@joinup/types';

export default function ChatConversationPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const { messages, addMessage, setMessages, setTyping, typingUsers } = useChatStore();
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeout = useRef<ReturnType<typeof setTimeout>>();
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const { data: convMessages, isLoading } = useQuery({
    queryKey: ['messages', id],
    queryFn: () => chatApi.getMessages(id).then((r) => r.data),
  });

  const { data: conversations } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => chatApi.getConversations().then((r) => r.data),
  });

  const conversation = conversations?.find((c: any) => c.id === id);
  const otherUser = conversation?.participants?.find((p: any) => p.user.id !== user?.id)?.user;
  const convName = conversation?.isGroup
    ? (conversation.name || conversation.trip?.title || 'Group Chat')
    : `${otherUser?.firstName || ''} ${otherUser?.lastName || ''}`;

  const currentMessages: Message[] = messages[id] || convMessages?.data || [];
  const typing = typingUsers[id] || [];

  useEffect(() => {
    if (convMessages?.data) {
      setMessages(id, convMessages.data);
    }
  }, [convMessages, id, setMessages]);

  useEffect(() => {
    const socket = getSocket();
    joinConversation(id);
    chatApi.markRead(id);

    socket.on('message:received', (message: Message) => {
      if (message.conversationId === id) {
        addMessage(id, message);
        chatApi.markRead(id);
      }
    });
    socket.on('user:typing', ({ userId, conversationId }: { userId: string; conversationId: string }) => {
      if (conversationId === id) setTyping(id, userId, true);
    });
    socket.on('user:stop-typing', ({ userId, conversationId }: { userId: string; conversationId: string }) => {
      if (conversationId === id) setTyping(id, userId, false);
    });

    return () => {
      leaveConversation(id);
      socket.off('message:received');
      socket.off('user:typing');
      socket.off('user:stop-typing');
    };
  }, [id, addMessage, setTyping]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  const handleSend = async () => {
    if (!input.trim() || sending) return;
    setSending(true);
    try {
      await sendMessage(id, input.trim());
      setInput('');
      emitStopTyping(id);
    } finally {
      setSending(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const res = await uploadApi.chatImage(file);
    await sendMessage(id, res.data.url, 'IMAGE');
  };

  const handleTyping = useCallback(() => {
    emitTyping(id);
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => emitStopTyping(id), 2000);
  }, [id]);

  const isMyMessage = (msg: Message) => msg.senderId === user?.id;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] -mx-4 sm:-mx-6 -my-6">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100 shrink-0">
        <button onClick={() => router.back()} className="p-1.5 hover:bg-surface rounded-lg text-gray-500">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          {conversation?.isGroup ? (
            <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-blue-500 rounded-full flex items-center justify-center shrink-0">
              <span className="text-white text-sm font-bold">G</span>
            </div>
          ) : (
            <Avatar src={otherUser?.avatar} firstName={otherUser?.firstName || ''} lastName={otherUser?.lastName || ''} size="sm" />
          )}
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 text-sm truncate">{convName}</p>
            {typing.length > 0 && (
              <p className="text-xs text-primary-500 animate-pulse">typing...</p>
            )}
            {conversation?.trip && (
              <Link href={`/trips/${conversation.trip.id}`} className="text-xs text-primary-600 hover:underline">
                📍 {conversation.trip.destination}
              </Link>
            )}
          </div>
        </div>
        <button className="p-2 hover:bg-surface rounded-xl text-gray-400">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-surface">
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {currentMessages.map((msg, i) => {
          const isMine = isMyMessage(msg);
          const showAvatar = !isMine && (i === 0 || currentMessages[i - 1]?.senderId !== msg.senderId);

          return (
            <div key={msg.id} className={`flex items-end gap-2 ${isMine ? 'justify-end' : 'justify-start'}`}>
              {!isMine && (
                <div className="w-7 shrink-0">
                  {showAvatar && (
                    <Avatar src={(msg.sender as any)?.avatar} firstName={(msg.sender as any)?.firstName || ''} lastName={(msg.sender as any)?.lastName || ''} size="xs" />
                  )}
                </div>
              )}
              <div className={`max-w-xs sm:max-w-sm ${isMine ? 'items-end' : 'items-start'} flex flex-col`}>
                {showAvatar && !isMine && (
                  <p className="text-xs text-gray-400 mb-1 px-1">{(msg.sender as any)?.firstName}</p>
                )}
                <div className={`px-3 py-2 rounded-2xl text-sm ${
                  isMine
                    ? 'bg-primary-600 text-white rounded-br-md'
                    : 'bg-white text-gray-900 rounded-bl-md shadow-soft'
                }`}>
                  {msg.type === 'IMAGE' ? (
                    <Image src={msg.content} alt="Shared image" width={200} height={150} className="rounded-xl object-cover" />
                  ) : (
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  )}
                </div>
                <span className="text-xs text-gray-400 mt-0.5 px-1">{timeAgo(msg.createdAt)}</span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 bg-white border-t border-gray-100 shrink-0">
        <div className="flex items-center gap-2 bg-surface rounded-2xl px-3 py-2">
          <input
            type="file"
            accept="image/*"
            ref={fileRef}
            onChange={handleImageUpload}
            className="hidden"
          />
          <button onClick={() => fileRef.current?.click()} className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors">
            <ImageIcon className="w-5 h-5" />
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => { setInput(e.target.value); handleTyping(); }}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="Type a message..."
            className="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
          />

          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className="p-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
