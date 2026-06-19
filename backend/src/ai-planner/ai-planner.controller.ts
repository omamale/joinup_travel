import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AiPlannerService } from './ai-planner.service';
import { AIPlannerDto } from './dto/ai-planner.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@ApiTags('ai-planner')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('ai-planner')
export class AiPlannerController {
  constructor(private aiPlannerService: AiPlannerService) {}

  @Post('generate')
  @ApiOperation({ summary: 'Generate AI travel itinerary' })
  generate(@GetUser('id') userId: string, @Body() dto: AIPlannerDto) {
    return this.aiPlannerService.generateItinerary(userId, dto);
  }

  @Get('my-plans')
  @ApiOperation({ summary: 'Get my saved AI plans' })
  getMyPlans(@GetUser('id') userId: string) {
    return this.aiPlannerService.getUserPlans(userId);
  }
}
