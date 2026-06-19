import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationType } from '@prisma/client';

interface CreateNotificationDto {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, string>;
}

@Injectable()
export class NotificationsService {
  private logger = new Logger('NotificationsService');

  constructor(private prisma: PrismaService) {}

  async create(dto: CreateNotificationDto) {
    const notification = await this.prisma.notification.create({ data: dto });

    // Send FCM push notification
    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId },
      select: { fcmToken: true },
    });

    if (user?.fcmToken) {
      await this.sendPushNotification(user.fcmToken, dto.title, dto.body, dto.data);
    }

    return notification;
  }

  async getForUser(userId: string, page = 1, limit = 20) {
    const [notifications, total, unreadCount] = await Promise.all([
      this.prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.notification.count({ where: { userId } }),
      this.prisma.notification.count({ where: { userId, isRead: false } }),
    ]);

    return { data: notifications, total, page, limit, unreadCount };
  }

  async markAllRead(userId: string) {
    await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
    return { message: 'All notifications marked as read' };
  }

  async markRead(userId: string, notificationId: string) {
    await this.prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true },
    });
    return { message: 'Notification marked as read' };
  }

  private async sendPushNotification(token: string, title: string, body: string, data?: Record<string, string>) {
    // Firebase Admin SDK integration
    try {
      // In production, use firebase-admin to send FCM notifications
      this.logger.log(`Push notification sent: ${title}`);
    } catch (error) {
      this.logger.error('Failed to send push notification', error);
    }
  }
}
