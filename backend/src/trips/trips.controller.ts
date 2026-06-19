import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { TripsService } from './trips.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { TripFiltersDto } from './dto/trip-filters.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@ApiTags('trips')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('trips')
export class TripsController {
  constructor(private tripsService: TripsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new trip' })
  create(@GetUser('id') userId: string, @Body() dto: CreateTripDto) {
    return this.tripsService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Browse all trips from Pune' })
  findAll(@GetUser('id') userId: string, @Query() filters: TripFiltersDto) {
    return this.tripsService.findAll(userId, filters);
  }

  @Get('my-trips')
  @ApiOperation({ summary: 'Get my organized and joined trips' })
  getMyTrips(@GetUser('id') userId: string) {
    return this.tripsService.getMyTrips(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get trip details' })
  findOne(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.tripsService.findOne(id, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update trip' })
  update(@Param('id') id: string, @GetUser('id') userId: string, @Body() dto: UpdateTripDto) {
    return this.tripsService.update(id, userId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancel/delete trip' })
  delete(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.tripsService.delete(id, userId);
  }

  @Post(':id/join')
  @ApiOperation({ summary: 'Request to join a trip' })
  requestJoin(
    @Param('id') tripId: string,
    @GetUser('id') userId: string,
    @Body('message') message?: string,
  ) {
    return this.tripsService.requestJoin(tripId, userId, message);
  }

  @Patch(':id/members/:memberId')
  @ApiOperation({ summary: 'Approve or reject join request' })
  respondToRequest(
    @Param('id') tripId: string,
    @Param('memberId') memberId: string,
    @GetUser('id') userId: string,
    @Body('status') status: 'APPROVED' | 'REJECTED',
  ) {
    return this.tripsService.respondToRequest(tripId, userId, memberId, status);
  }
}
