import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { TripFiltersDto } from './dto/trip-filters.dto';
import { NotificationsService } from '../notifications/notifications.service';

const TRIP_INCLUDE = {
  organizer: {
    select: { id: true, firstName: true, lastName: true, avatar: true, verificationStatus: true, trustScore: true },
  },
  members: {
    where: { status: 'APPROVED' as const },
    include: {
      user: { select: { id: true, firstName: true, lastName: true, avatar: true, verificationStatus: true } },
    },
  },
};

@Injectable()
export class TripsService {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
  ) {}

  async create(userId: string, dto: CreateTripDto) {
    const trip = await this.prisma.trip.create({
      data: { ...dto, organizerId: userId, currentMembers: 1, originCity: 'Pune' },
      include: TRIP_INCLUDE,
    });

    // Auto-add organizer as approved member
    await this.prisma.tripMember.create({
      data: { userId, tripId: trip.id, status: 'APPROVED' },
    });

    // Create group conversation
    await this.prisma.conversation.create({
      data: {
        tripId: trip.id,
        isGroup: true,
        name: trip.title,
        participants: { create: { userId } },
      },
    });

    return trip;
  }

  async findAll(userId: string, filters: TripFiltersDto) {
    const { page = 1, limit = 12, search, destination, tripType, budgetMin, budgetMax,
      genderPreference, startDate, endDate } = filters;

    const where: any = {
      originCity: 'Pune',
      status: { in: ['OPEN', 'FULL'] },
      isPublic: true,
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { destination: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (destination) where.destination = { contains: destination, mode: 'insensitive' };
    if (tripType) where.tripType = tripType;
    if (genderPreference) where.genderPreference = genderPreference;
    if (budgetMin || budgetMax) where.budget = { gte: budgetMin, lte: budgetMax };
    if (startDate) where.startDate = { gte: new Date(startDate) };
    if (endDate) where.endDate = { lte: new Date(endDate) };

    const [trips, total] = await Promise.all([
      this.prisma.trip.findMany({
        where,
        include: TRIP_INCLUDE,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.trip.count({ where }),
    ]);

    const userMemberships = await this.prisma.tripMember.findMany({
      where: { userId, tripId: { in: trips.map((t) => t.id) } },
    });

    const enriched = trips.map((trip) => {
      const membership = userMemberships.find((m) => m.tripId === trip.id);
      return {
        ...trip,
        isJoined: membership?.status === 'APPROVED',
        isPending: membership?.status === 'PENDING',
      };
    });

    return { data: enriched, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string, userId?: string) {
    const trip = await this.prisma.trip.findUnique({
      where: { id },
      include: {
        ...TRIP_INCLUDE,
        members: {
          include: {
            user: { select: { id: true, firstName: true, lastName: true, avatar: true, verificationStatus: true, trustScore: true } },
          },
        },
      },
    });
    if (!trip) throw new NotFoundException('Trip not found');

    if (userId) {
      const membership = await this.prisma.tripMember.findUnique({ where: { userId_tripId: { userId, tripId: id } } });
      return { ...trip, isJoined: membership?.status === 'APPROVED', isPending: membership?.status === 'PENDING' };
    }
    return trip;
  }

  async update(tripId: string, userId: string, dto: UpdateTripDto) {
    const trip = await this.prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) throw new NotFoundException('Trip not found');
    if (trip.organizerId !== userId) throw new ForbiddenException('Only the organizer can edit this trip');

    return this.prisma.trip.update({ where: { id: tripId }, data: dto, include: TRIP_INCLUDE });
  }

  async delete(tripId: string, userId: string) {
    const trip = await this.prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) throw new NotFoundException('Trip not found');
    if (trip.organizerId !== userId) throw new ForbiddenException('Only the organizer can delete this trip');
    if (['ONGOING', 'COMPLETED'].includes(trip.status)) {
      throw new BadRequestException('Cannot delete an ongoing or completed trip');
    }

    await this.prisma.trip.update({ where: { id: tripId }, data: { status: 'CANCELLED' } });
    return { message: 'Trip cancelled successfully' };
  }

  async requestJoin(tripId: string, userId: string, message?: string) {
    const trip = await this.prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) throw new NotFoundException('Trip not found');
    if (trip.status !== 'OPEN') throw new BadRequestException('This trip is not accepting members');
    if (trip.organizerId === userId) throw new BadRequestException('You are the organizer of this trip');

    const existing = await this.prisma.tripMember.findUnique({
      where: { userId_tripId: { userId, tripId } },
    });
    if (existing) {
      if (existing.status === 'APPROVED') throw new BadRequestException('You are already a member');
      if (existing.status === 'PENDING') throw new BadRequestException('Request already sent');
    }

    const member = await this.prisma.tripMember.upsert({
      where: { userId_tripId: { userId, tripId } },
      create: { userId, tripId, status: 'PENDING', message },
      update: { status: 'PENDING', message },
    });

    // Notify organizer
    const requester = await this.prisma.user.findUnique({ where: { id: userId }, select: { firstName: true, lastName: true } });
    await this.notifications.create({
      userId: trip.organizerId,
      type: 'TRIP_REQUEST',
      title: 'New Join Request',
      body: `${requester?.firstName} ${requester?.lastName} wants to join "${trip.title}"`,
      data: { tripId, userId },
    });

    return member;
  }

  async respondToRequest(tripId: string, organizerId: string, memberId: string, status: 'APPROVED' | 'REJECTED') {
    const trip = await this.prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) throw new NotFoundException('Trip not found');
    if (trip.organizerId !== organizerId) throw new ForbiddenException('Only the organizer can respond to requests');

    const member = await this.prisma.tripMember.findUnique({
      where: { userId_tripId: { userId: memberId, tripId } },
    });
    if (!member || member.status !== 'PENDING') throw new NotFoundException('Pending request not found');

    if (status === 'APPROVED' && trip.currentMembers >= trip.maxMembers) {
      throw new BadRequestException('Trip is already full');
    }

    await this.prisma.tripMember.update({
      where: { userId_tripId: { userId: memberId, tripId } },
      data: { status },
    });

    if (status === 'APPROVED') {
      await this.prisma.trip.update({ where: { id: tripId }, data: { currentMembers: { increment: 1 } } });

      // Add to group conversation
      const conversation = await this.prisma.conversation.findUnique({ where: { tripId } });
      if (conversation) {
        await this.prisma.conversationParticipant.upsert({
          where: { conversationId_userId: { conversationId: conversation.id, userId: memberId } },
          create: { conversationId: conversation.id, userId: memberId },
          update: {},
        });
      }
    }

    await this.notifications.create({
      userId: memberId,
      type: status === 'APPROVED' ? 'REQUEST_APPROVED' : 'REQUEST_REJECTED',
      title: status === 'APPROVED' ? 'Request Approved!' : 'Request Rejected',
      body: status === 'APPROVED'
        ? `You have been approved to join "${trip.title}"`
        : `Your request to join "${trip.title}" was not approved`,
      data: { tripId },
    });

    return { message: `Request ${status.toLowerCase()} successfully` };
  }

  async getMyTrips(userId: string) {
    const [organized, joined] = await Promise.all([
      this.prisma.trip.findMany({
        where: { organizerId: userId },
        include: TRIP_INCLUDE,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.tripMember.findMany({
        where: { userId, status: 'APPROVED', trip: { organizerId: { not: userId } } },
        include: { trip: { include: TRIP_INCLUDE } },
        orderBy: { joinedAt: 'desc' },
      }),
    ]);

    return {
      organized,
      joined: joined.map((m) => m.trip),
    };
  }
}
