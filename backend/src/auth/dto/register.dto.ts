import { IsEmail, IsString, MinLength, IsOptional, IsEnum, IsInt, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Gender } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({ example: 'Rahul' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Sharma' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'rahul@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'SecurePass@123', minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiPropertyOptional({ example: '+919876543210' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ enum: Gender })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional({ example: 25 })
  @IsOptional()
  @IsInt()
  @Min(18)
  @Max(80)
  age?: number;
}

export class LoginDto {
  @ApiProperty({ example: 'rahul@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'SecurePass@123' })
  @IsString()
  password: string;
}

export class PhoneLoginDto {
  @ApiProperty({ example: '+919876543210' })
  @IsString()
  phone: string;
}

export class VerifyOtpDto {
  @ApiProperty({ example: '+919876543210' })
  @IsString()
  phone: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  otp: string;
}

export class RefreshTokenDto {
  @ApiProperty()
  @IsString()
  refreshToken: string;
}
