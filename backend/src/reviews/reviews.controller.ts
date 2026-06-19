import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@ApiTags('reviews')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Post()
  @ApiOperation({ summary: 'Write a review for a trip companion' })
  create(
    @GetUser('id') userId: string,
    @Body() data: { revieweeId: string; tripId: string; rating: number; comment: string },
  ) {
    return this.reviewsService.createReview(userId, data);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all reviews for a user' })
  getForUser(@Param('userId') userId: string) {
    return this.reviewsService.getReviewsForUser(userId);
  }

  @Get('trip/:tripId')
  @ApiOperation({ summary: 'Get all reviews for a trip' })
  getForTrip(@Param('tripId') tripId: string) {
    return this.reviewsService.getReviewsForTrip(tripId);
  }
}
