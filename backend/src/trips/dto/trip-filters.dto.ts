import { IsOptional, IsString, IsEnum, IsNumber, IsDateString, IsInt, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TripType, GenderPreference } from '@prisma/client';
import { Type } from 'class-transformer';

export class TripFiltersDto {
  @ApiPropertyOptional() @IsOptional() @IsString() search?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() destination?: string;
  @ApiPropertyOptional({ enum: TripType }) @IsOptional() @IsEnum(TripType) tripType?: TripType;
  @ApiPropertyOptional({ enum: GenderPreference }) @IsOptional() @IsEnum(GenderPreference) genderPreference?: GenderPreference;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() budgetMin?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() budgetMax?: number;
  @ApiPropertyOptional() @IsOptional() @IsDateString() startDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() endDate?: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() @Min(1) limit?: number;
}
