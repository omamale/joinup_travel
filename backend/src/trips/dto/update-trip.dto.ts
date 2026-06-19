import { PartialType } from '@nestjs/swagger';
import { CreateTripDto } from './create-trip.dto';
import { IsOptional, IsEnum } from 'class-validator';
import { TripStatus } from '@prisma/client';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTripDto extends PartialType(CreateTripDto) {
  @ApiPropertyOptional({ enum: TripStatus })
  @IsOptional()
  @IsEnum(TripStatus)
  status?: TripStatus;
}
