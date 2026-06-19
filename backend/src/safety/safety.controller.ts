import { Controller, Post, Get, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SafetyService } from './safety.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { ReportReason } from '@prisma/client';

@ApiTags('safety')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('safety')
export class SafetyController {
  constructor(private safetyService: SafetyService) {}

  @Post('sos')
  @ApiOperation({ summary: 'Trigger SOS alert' })
  triggerSOS(@GetUser('id') userId: string, @Body() data: { lat: number; lng: number; tripId?: string; message?: string }) {
    return this.safetyService.triggerSOS(userId, data);
  }

  @Get('emergency-contacts')
  getEmergencyContacts(@GetUser('id') userId: string) {
    return this.safetyService.getEmergencyContacts(userId);
  }

  @Post('emergency-contacts')
  addEmergencyContact(
    @GetUser('id') userId: string,
    @Body() data: { name: string; phone: string; relationship: string },
  ) {
    return this.safetyService.addEmergencyContact(userId, data);
  }

  @Delete('emergency-contacts/:id')
  deleteEmergencyContact(@GetUser('id') userId: string, @Param('id') id: string) {
    return this.safetyService.deleteEmergencyContact(userId, id);
  }

  @Post('report')
  @ApiOperation({ summary: 'Report a user' })
  reportUser(
    @GetUser('id') userId: string,
    @Body() data: { reportedUserId: string; reason: ReportReason; description?: string },
  ) {
    return this.safetyService.reportUser(userId, data);
  }

  @Post('block/:userId')
  @ApiOperation({ summary: 'Block a user' })
  blockUser(@GetUser('id') userId: string, @Param('userId') blockedId: string) {
    return this.safetyService.blockUser(userId, blockedId);
  }

  @Delete('block/:userId')
  @ApiOperation({ summary: 'Unblock a user' })
  unblockUser(@GetUser('id') userId: string, @Param('userId') blockedId: string) {
    return this.safetyService.unblockUser(userId, blockedId);
  }

  @Get('blocked-users')
  getBlockedUsers(@GetUser('id') userId: string) {
    return this.safetyService.getBlockedUsers(userId);
  }
}
