import {
  Controller, Post, Get, Body, UseGuards, Req, Res, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, PhoneLoginDto, VerifyOtpDto, RefreshTokenDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GetUser } from './decorators/get-user.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register with email & password' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email & password' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('phone/send-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send OTP to phone number' })
  sendOTP(@Body() dto: PhoneLoginDto) {
    return this.authService.sendOTP(dto.phone);
  }

  @Post('phone/verify-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify OTP and login/register' })
  verifyOTP(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOTP(dto);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Initiate Google OAuth' })
  googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google OAuth callback' })
  async googleCallback(@Req() req: any, @Res() res: Response) {
    const tokens = await this.authService.googleLogin(req.user);
    const redirectUrl = `${process.env.FRONTEND_URL}/auth/callback?token=${tokens.accessToken}&refresh=${tokens.refreshToken}`;
    res.redirect(redirectUrl);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto.refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout and invalidate refresh token' })
  logout(@GetUser('id') userId: string, @Body() dto: RefreshTokenDto) {
    return this.authService.logout(userId, dto.refreshToken);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user' })
  getMe(@GetUser() user: any) {
    return user;
  }
}
