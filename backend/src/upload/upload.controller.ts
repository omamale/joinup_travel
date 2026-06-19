import { Controller, Post, UseInterceptors, UploadedFile, Param, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { memoryStorage } from 'multer';

@ApiTags('upload')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('upload')
export class UploadController {
  constructor(
    private uploadService: UploadService,
    private prisma: PrismaService,
  ) {}

  @Post('avatar')
  @ApiOperation({ summary: 'Upload profile avatar' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async uploadAvatar(@GetUser('id') userId: string, @UploadedFile() file: Express.Multer.File) {
    const url = await this.uploadService.uploadImage(file, 'avatars');
    await this.prisma.user.update({ where: { id: userId }, data: { avatar: url } });
    return { url };
  }

  @Post('trip-cover')
  @ApiOperation({ summary: 'Upload trip cover image' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async uploadTripCover(@UploadedFile() file: Express.Multer.File) {
    const url = await this.uploadService.uploadImage(file, 'trips');
    return { url };
  }

  @Post('id-document')
  @ApiOperation({ summary: 'Upload government ID for verification' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async uploadIdDocument(@GetUser('id') userId: string, @UploadedFile() file: Express.Multer.File) {
    const url = await this.uploadService.uploadImage(file, 'documents');
    await this.prisma.user.update({ where: { id: userId }, data: { idDocumentUrl: url, idVerified: false } });
    return { url, message: 'Document uploaded. Verification is under review.' };
  }

  @Post('chat-image')
  @ApiOperation({ summary: 'Upload image for chat' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async uploadChatImage(@UploadedFile() file: Express.Multer.File) {
    const url = await this.uploadService.uploadImage(file, 'chat');
    return { url };
  }
}
