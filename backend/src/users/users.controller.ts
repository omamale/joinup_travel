import { Controller, Get, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@ApiTags('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('search')
  @ApiOperation({ summary: 'Search users' })
  searchUsers(@Query('q') query: string) {
    return this.usersService.searchUsers(query);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get my profile' })
  getMe(@GetUser('id') userId: string) {
    return this.usersService.findById(userId);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update my profile' })
  updateProfile(@GetUser('id') userId: string, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(userId, dto);
  }

  @Get('me/trust-score')
  @ApiOperation({ summary: 'Get my trust score breakdown' })
  getTrustScore(@GetUser('id') userId: string) {
    return this.usersService.getTrustScore(userId);
  }

  @Patch('me/fcm-token')
  @ApiOperation({ summary: 'Update FCM push notification token' })
  updateFCMToken(@GetUser('id') userId: string, @Body('token') token: string) {
    return this.usersService.updateFCMToken(userId, token);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get public profile of a user' })
  getProfile(@Param('id') id: string) {
    return this.usersService.getPublicProfile(id);
  }
}
