'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { MessageCircle, Users, Search } from 'lucide-react';
import { chatApi } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { timeAgo } from '@/lib/utils';
import { useState } from 'react';

export default function ChatPage() {
  const { user } = useAuthStore();
  const [search, setSearch] = useState('');

  const { data: conversations, isLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => chatApi.getConversations().then((r) => r.data),
    refetchInterval: 5000,
  });

  const filtered = (conversations || []).filter((c: any) => {
    if (!search) return true;
    const name = c.isGroup ? c.name : c.participants?.find((p: any) => p.user.id !== user?.id)?.user.firstName || '';
    return name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-sm text-gray-500 mt-0.5">Chat with your travel companions</p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search conversations..."
          className="input-field pl-10 w-full"
        />
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card p-4 flex items-center gap-3 animate-pulse">
              <div className="w-12 h-12 rounded-full bg-gray-200" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-3 bg-gray-100 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 card">
          <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-1">No conversations yet</h3>
          <p className="text-sm text-gray-400">Join a trip or send a message to a traveler to start chatting</p>
        </div>
      ) : (
        <div className="space-y-1">
          {filtered.map((conv: any) => {
            const otherUser = conv.isGroup ? null : conv.participants?.find((p: any) => p.user.id !== user?.id)?.user;
            const name = conv.isGroup ? (conv.name || conv.trip?.title || 'Group Chat') : `${otherUser?.firstName} ${otherUser?.lastName}`;
            const avatar = conv.isGroup ? null : otherUser?.avatar;
            const firstName = conv.isGroup ? 'G' : (otherUser?.firstName || '');
            const lastName = conv.isGroup ? 'C' : (otherUser?.lastName || '');
            const lastMsg = conv.messages?.[0] || conv.lastMessage;

            return (
              <Link key={conv.id} href={`/chat/${conv.id}`}>
                <div className="flex items-center gap-3 p-4 rounded-xl hover:bg-surface transition-colors cursor-pointer">
                  <div className="relative shrink-0">
                    {conv.isGroup ? (
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-blue-500 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                    ) : (
                      <Avatar src={avatar} firstName={firstName} lastName={lastName} size="md" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-gray-900 truncate text-sm">{name}</p>
                      {lastMsg && <span className="text-xs text-gray-400 shrink-0 ml-2">{timeAgo(lastMsg.createdAt)}</span>}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-400 truncate">
                        {lastMsg ? (lastMsg.senderId === user?.id ? `You: ${lastMsg.content}` : lastMsg.content) : 'No messages yet'}
                      </p>
                      {conv.unreadCount > 0 && (
                        <span className="shrink-0 ml-2 w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">
                          {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
                        </span>
                      )}
                    </div>
                    {conv.isGroup && conv.trip && (
                      <Badge variant="primary" size="sm" className="mt-0.5">
                        {conv.trip.destination}
                      </Badge>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
