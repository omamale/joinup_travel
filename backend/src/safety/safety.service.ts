import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { ReportReason } from '@prisma/client';

@Injectable()
export class SafetyService {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
  ) {}

  async triggerSOS(userId: string, data: { lat: number; lng: number; tripId?: string; message?: string }) {
    const { lat, lng, ...rest } = data;
    const alert = await this.prisma.sOSAlert.create({
      data: { userId, latitude: lat, longitude: lng, ...rest },
    });

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { firstName: true, lastName: true, emergencyContacts: true },
    });

    // TODO: send SMS to emergency contacts via Twilio
    console.log(`SOS alert from ${(user as any)?.firstName}: lat=${data.lat}, lng=${data.lng}`);

    // Notify trip members
    if (data.tripId) {
      const members = await this.prisma.tripMember.findMany({
        where: { tripId: data.tripId, status: 'APPROVED' },
      });
      await Promise.all(
        members.map((m) =>
          this.notifications.create({
            userId: m.userId,
            type: 'SOS_ALERT',
            title: '🚨 SOS Alert',
            body: `${(user as any)?.firstName} has triggered an SOS alert!`,
            data: { alertId: alert.id, tripId: data.tripId ?? '' },
          }),
        ),
      );
    }

    return { message: 'SOS alert sent', alertId: alert.id };
  }

  async addEmergencyContact(userId: string, data: { name: string; phone: string; relationship: string }) {
    const count = await this.prisma.emergencyContact.count({ where: { userId } });
    if (count >= 3) throw new Error('Maximum 3 emergency contacts allowed');

    return this.prisma.emergencyContact.create({ data: { ...data, userId } });
  }

  async getEmergencyContacts(userId: string) {
    return this.prisma.emergencyContact.findMany({ where: { userId } });
  }

  async deleteEmergencyContact(userId: string, contactId: string) {
    const contact = await this.prisma.emergencyContact.findFirst({ where: { id: contactId, userId } });
    if (!contact) throw new NotFoundException('Contact not found');
    await this.prisma.emergencyContact.delete({ where: { id: contactId } });
    return { message: 'Contact removed' };
  }

  async reportUser(reporterId: string, data: { reportedUserId: string; reason: ReportReason; description?: string }) {
    return this.prisma.userReport.create({
      data: { reporterId, ...data },
    });
  }

  async blockUser(blockerId: string, blockedId: string) {
    await this.prisma.userBlock.upsert({
      where: { blockerId_blockedId: { blockerId, blockedId } },
      create: { blockerId, blockedId },
      update: {},
    });
    return { message: 'User blocked' };
  }

  async unblockUser(blockerId: string, blockedId: string) {
    await this.prisma.userBlock.deleteMany({ where: { blockerId, blockedId } });
    return { message: 'User unblocked' };
  }

  async getBlockedUsers(userId: string) {
    return this.prisma.userBlock.findMany({
      where: { blockerId: userId },
      include: { blocked: { select: { id: true, firstName: true, lastName: true, avatar: true } } },
    });
  }
}
