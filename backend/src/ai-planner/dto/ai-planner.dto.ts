import { IsString, IsNumber, IsEnum, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum TravelStyle { RELAXED = 'RELAXED', MODERATE = 'MODERATE', FAST_PACED = 'FAST_PACED', ADVENTURE = 'ADVENTURE' }
export enum FoodPreference { VEG = 'VEG', NON_VEG = 'NON_VEG', VEGAN = 'VEGAN', JAIN = 'JAIN' }

export class AIPlannerDto {
  @ApiProperty({ example: 'Goa' }) @IsString() destination: string;
  @ApiProperty({ example: 30000 }) @IsNumber() @Min(1000) budget: number;
  @ApiProperty({ example: 5 }) @IsInt() @Min(1) @Max(30) days: number;
  @ApiProperty({ enum: FoodPreference }) @IsEnum(FoodPreference) foodPreference: FoodPreference;
  @ApiProperty({ enum: TravelStyle }) @IsEnum(TravelStyle) travelStyle: TravelStyle;
  @ApiProperty({ example: 2 }) @IsInt() @Min(1) @Max(20) numberOfPeople: number;
}
