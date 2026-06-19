import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async getConversations(userId: string) {
    const participations = await this.prisma.conversationParticipant.findMany({
      where: { userId },
      include: {
        conversation: {
          include: {
            participants: {
              include: {
                user: { select: { id: true, firstName: true, lastName: true, avatar: true, lastSeen: true } },
              },
            },
            messages: {
              orderBy: { createdAt: 'desc' },
              take: 1,
              include: { sender: { select: { id: true, firstName: true, lastName: true } } },
            },
            trip: { select: { id: true, title: true, destination: true, coverImage: true } },
          },
        },
      },
      orderBy: { conversation: { updatedAt: 'desc' } },
    });

    return participations.map((p) => {
      const conv = p.conversation;
      const unreadCount = conv.messages.filter(
        (m) => !m.readBy.includes(userId) && m.senderId !== userId,
      ).length;
      return { ...conv, unreadCount };
    });
  }

  async getOrCreateDirectConversation(userId1: string, userId2: string) {
    const existing = await this.prisma.conversation.findFirst({
      where: {
        isGroup: false,
        AND: [
          { participants: { some: { userId: userId1 } } },
          { participants: { some: { userId: userId2 } } },
        ],
      },
      include: { participants: { include: { user: { select: { id: true, firstName: true, lastName: true, avatar: true } } } } },
    });

    if (existing) return existing;

    return this.prisma.conversation.create({
      data: {
        isGroup: false,
        participants: { create: [{ userId: userId1 }, { userId: userId2 }] },
      },
      include: { participants: { include: { user: { select: { id: true, firstName: true, lastName: true, avatar: true } } } } },
    });
  }

  async getMessages(conversationId: string, userId: string, page = 1, limit = 50) {
    const participant = await this.prisma.conversationParticipant.findUnique({
      where: { conversationId_userId: { conversationId, userId } },
    });
    if (!participant) throw new ForbiddenException('Not a participant in this conversation');

    const [messages, total] = await Promise.all([
      this.prisma.message.findMany({
        where: { conversationId },
        include: { sender: { select: { id: true, firstName: true, lastName: true, avatar: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.message.count({ where: { conversationId } }),
    ]);

    return { data: messages.reverse(), total, page, limit };
  }

  async saveMessage(data: { content: string; type: string; senderId: string; conversationId: string }) {
    const message = await this.prisma.message.create({
      data: { ...data, type: data.type as any, readBy: [data.senderId] },
      include: { sender: { select: { id: true, firstName: true, lastName: true, avatar: true } } },
    });

    await this.prisma.conversation.update({
      where: { id: data.conversationId },
      data: { updatedAt: new Date() },
    });

    return message;
  }

  async markAsRead(conversationId: string, userId: string) {
    const unreadMessages = await this.prisma.message.findMany({
      where: { conversationId, NOT: { readBy: { has: userId } } },
      select: { id: true },
    });

    await Promise.all(
      unreadMessages.map((m) =>
        this.prisma.message.update({
          where: { id: m.id },
          data: { readBy: { push: userId } },
        }),
      ),
    );

    await this.prisma.conversationParticipant.update({
      where: { conversationId_userId: { conversationId, userId } },
      data: { lastReadAt: new Date() },
    });

    return { markedRead: unreadMessages.length };
  }
}
