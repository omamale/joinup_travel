import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async createReview(reviewerId: string, data: { revieweeId: string; tripId: string; rating: number; comment: string }) {
    if (reviewerId === data.revieweeId) throw new BadRequestException('Cannot review yourself');
    if (data.rating < 1 || data.rating > 5) throw new BadRequestException('Rating must be between 1 and 5');

    // Verify both users were on the trip
    const [reviewerMember, revieweeMember] = await Promise.all([
      this.prisma.tripMember.findUnique({
        where: { userId_tripId: { userId: reviewerId, tripId: data.tripId } },
      }),
      this.prisma.tripMember.findUnique({
        where: { userId_tripId: { userId: data.revieweeId, tripId: data.tripId } },
      }),
    ]);

    if (!reviewerMember || reviewerMember.status !== 'APPROVED') {
      throw new BadRequestException('You must be a member of this trip to review');
    }
    if (!revieweeMember || revieweeMember.status !== 'APPROVED') {
      throw new BadRequestException('Reviewee is not a member of this trip');
    }

    const review = await this.prisma.review.create({
      data: { reviewerId, ...data },
      include: {
        reviewer: { select: { id: true, firstName: true, lastName: true, avatar: true } },
        trip: { select: { id: true, title: true, destination: true } },
      },
    });

    // Update trust score
    await this.updateAverageRating(data.revieweeId);

    return review;
  }

  async getReviewsForUser(userId: string) {
    return this.prisma.review.findMany({
      where: { revieweeId: userId },
      include: {
        reviewer: { select: { id: true, firstName: true, lastName: true, avatar: true } },
        trip: { select: { id: true, title: true, destination: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getReviewsForTrip(tripId: string) {
    return this.prisma.review.findMany({
      where: { tripId },
      include: {
        reviewer: { select: { id: true, firstName: true, lastName: true, avatar: true } },
        reviewee: { select: { id: true, firstName: true, lastName: true, avatar: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  private async updateAverageRating(userId: string) {
    const reviews = await this.prisma.review.findMany({ where: { revieweeId: userId }, select: { rating: true } });
    if (!reviews.length) return;
    const avg = reviews.reduce((a, r) => a + r.rating, 0) / reviews.length;
    await this.prisma.user.update({ where: { id: userId }, data: { trustScore: avg * 20 } });
  }
}
