import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@ApiTags('chat')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('conversations')
  @ApiOperation({ summary: 'Get all conversations' })
  getConversations(@GetUser('id') userId: string) {
    return this.chatService.getConversations(userId);
  }

  @Post('conversations/direct')
  @ApiOperation({ summary: 'Get or create direct conversation with a user' })
  getOrCreateDirect(@GetUser('id') userId: string, @Body('targetUserId') targetUserId: string) {
    return this.chatService.getOrCreateDirectConversation(userId, targetUserId);
  }

  @Get('conversations/:id/messages')
  @ApiOperation({ summary: 'Get messages in a conversation' })
  getMessages(
    @Param('id') conversationId: string,
    @GetUser('id') userId: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.chatService.getMessages(conversationId, userId, page, limit);
  }

  @Post('conversations/:id/read')
  @ApiOperation({ summary: 'Mark all messages in conversation as read' })
  markAsRead(@Param('id') conversationId: string, @GetUser('id') userId: string) {
    return this.chatService.markAsRead(conversationId, userId);
  }
}
