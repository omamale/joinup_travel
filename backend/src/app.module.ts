import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TripsModule } from './trips/trips.module';
import { ChatModule } from './chat/chat.module';
import { AiPlannerModule } from './ai-planner/ai-planner.module';
import { SafetyModule } from './safety/safety.module';
import { ReviewsModule } from './reviews/reviews.module';
import { UploadModule } from './upload/upload.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    UsersModule,
    TripsModule,
    ChatModule,
    AiPlannerModule,
    SafetyModule,
    ReviewsModule,
    UploadModule,
    NotificationsModule,
  ],
})
export class AppModule {}
