import { IsString, IsDateString, IsNumber, IsEnum, IsOptional, IsInt, Min, Max, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BudgetRange, TripType, GenderPreference } from '@prisma/client';

export class CreateTripDto {
  @ApiProperty() @IsString() title: string;
  @ApiProperty() @IsString() description: string;
  @ApiProperty() @IsString() destination: string;
  @ApiProperty() @IsDateString() startDate: string;
  @ApiProperty() @IsDateString() endDate: string;
  @ApiProperty() @IsNumber() @Min(0) budget: number;
  @ApiProperty({ enum: BudgetRange }) @IsEnum(BudgetRange) budgetRange: BudgetRange;
  @ApiProperty({ enum: TripType }) @IsEnum(TripType) tripType: TripType;
  @ApiProperty() @IsInt() @Min(2) @Max(50) maxMembers: number;
  @ApiPropertyOptional({ enum: GenderPreference }) @IsOptional() @IsEnum(GenderPreference) genderPreference?: GenderPreference;
  @ApiPropertyOptional() @IsOptional() @IsString() meetingPoint?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() meetingPointLat?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() meetingPointLng?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() destinationLat?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() destinationLng?: number;
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() tags?: string[];
  @ApiPropertyOptional() @IsOptional() @IsString() coverImage?: string;
}
