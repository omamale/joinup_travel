import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

const USER_SELECT = {
  id: true, email: true, phone: true, firstName: true, lastName: true,
  avatar: true, bio: true, age: true, gender: true, role: true,
  verificationStatus: true, trustScore: true, isActive: true,
  travelInterests: true, languagesSpoken: true, budgetPreference: true,
  emailVerified: true, phoneVerified: true, idVerified: true, selfieVerified: true,
  createdAt: true, updatedAt: true, lastSeen: true,
};

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id }, select: USER_SELECT });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async getPublicProfile(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        ...USER_SELECT,
        tripsOrganized: {
          where: { status: { in: ['COMPLETED', 'OPEN', 'ONGOING'] } },
          take: 6,
          orderBy: { createdAt: 'desc' },
        },
        reviewsReceived: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            reviewer: { select: { id: true, firstName: true, lastName: true, avatar: true } },
            trip: { select: { id: true, title: true, destination: true } },
          },
        },
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: dto,
      select: USER_SELECT,
    });
  }

  async updateFCMToken(userId: string, token: string) {
    return this.prisma.user.update({ where: { id: userId }, data: { fcmToken: token } });
  }

  async updateLastSeen(userId: string) {
    return this.prisma.user.update({ where: { id: userId }, data: { lastSeen: new Date() } });
  }

  async getTrustScore(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        emailVerified: true, phoneVerified: true, idVerified: true, selfieVerified: true,
        createdAt: true, trustScore: true,
        reviewsReceived: { select: { rating: true } },
        tripsOrganized: { where: { status: 'COMPLETED' }, select: { id: true } },
        tripMemberships: { where: { status: 'APPROVED' }, select: { id: true } },
        reportsReceived: { where: { status: { not: 'DISMISSED' } }, select: { id: true } },
      },
    });
    if (!user) throw new NotFoundException('User not found');

    let score = 0;
    if (user.emailVerified) score += 10;
    if (user.phoneVerified) score += 15;
    if (user.idVerified) score += 25;
    if (user.selfieVerified) score += 15;

    const completedTrips = user.tripsOrganized.length + user.tripMemberships.length;
    score += Math.min(completedTrips * 5, 20);

    if (user.reviewsReceived.length > 0) {
      const avg = user.reviewsReceived.reduce((a, r) => a + r.rating, 0) / user.reviewsReceived.length;
      score += Math.round(avg * 3);
    }

    score -= user.reportsReceived.length * 10;

    const accountAgeDays = (Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24);
    if (accountAgeDays > 30) score += 5;
    if (accountAgeDays > 90) score += 5;

    const finalScore = Math.max(0, Math.min(100, score));

    await this.prisma.user.update({ where: { id: userId }, data: { trustScore: finalScore } });
    return { trustScore: finalScore };
  }

  async searchUsers(query: string, limit = 10) {
    return this.prisma.user.findMany({
      where: {
        isActive: true,
        OR: [
          { firstName: { contains: query, mode: 'insensitive' } },
          { lastName: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: { id: true, firstName: true, lastName: true, avatar: true, verificationStatus: true, trustScore: true },
      take: limit,
    });
  }
}
