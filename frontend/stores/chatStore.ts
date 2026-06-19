import { create } from 'zustand';
import { Conversation, Message } from '@joinup/types';

interface ChatStore {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: Record<string, Message[]>;
  typingUsers: Record<string, string[]>;

  setConversations: (conversations: Conversation[]) => void;
  setActiveConversation: (conversation: Conversation | null) => void;
  addMessage: (conversationId: string, message: Message) => void;
  setMessages: (conversationId: string, messages: Message[]) => void;
  setTyping: (conversationId: string, userId: string, isTyping: boolean) => void;
  markConversationRead: (conversationId: string) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  conversations: [],
  activeConversation: null,
  messages: {},
  typingUsers: {},

  setConversations: (conversations) => set({ conversations }),

  setActiveConversation: (conversation) => set({ activeConversation: conversation }),

  addMessage: (conversationId, message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: [...(state.messages[conversationId] || []), message],
      },
      conversations: state.conversations.map((c) =>
        c.id === conversationId ? { ...c, lastMessage: message } : c,
      ),
    })),

  setMessages: (conversationId, messages) =>
    set((state) => ({
      messages: { ...state.messages, [conversationId]: messages },
    })),

  setTyping: (conversationId, userId, isTyping) =>
    set((state) => {
      const current = state.typingUsers[conversationId] || [];
      const updated = isTyping ? [...new Set([...current, userId])] : current.filter((id) => id !== userId);
      return { typingUsers: { ...state.typingUsers, [conversationId]: updated } };
    }),

  markConversationRead: (conversationId) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId ? { ...c, unreadCount: 0 } : c,
      ),
    })),
}));
