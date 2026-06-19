import { IsString, IsOptional, IsEnum, IsInt, Min, Max, IsArray } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Gender, BudgetRange } from '@prisma/client';

export class UpdateProfileDto {
  @ApiPropertyOptional() @IsOptional() @IsString() firstName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() lastName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() bio?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(18) @Max(80) age?: number;
  @ApiPropertyOptional({ enum: Gender }) @IsOptional() @IsEnum(Gender) gender?: Gender;
  @ApiPropertyOptional({ enum: BudgetRange }) @IsOptional() @IsEnum(BudgetRange) budgetPreference?: BudgetRange;
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() travelInterests?: string[];
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() languagesSpoken?: string[];
}
