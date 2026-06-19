import { Controller, Get, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@ApiTags('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get my notifications' })
  getNotifications(
    @GetUser('id') userId: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.notificationsService.getForUser(userId, page, limit);
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  markAllRead(@GetUser('id') userId: string) {
    return this.notificationsService.markAllRead(userId);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark a notification as read' })
  markRead(@GetUser('id') userId: string, @Param('id') id: string) {
    return this.notificationsService.markRead(userId, id);
  }
}
