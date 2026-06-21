import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { RegisterDto, LoginDto, VerifyOtpDto } from './dto/register.dto';
import { User } from '@prisma/client';
import * as crypto from 'crypto';
import axios from 'axios';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already registered');

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        password: hashedPassword,
        phone: dto.phone,
        gender: dto.gender,
        age: dto.age,
        provider: 'EMAIL',
      },
    });

    return this.generateTokens(user);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user || !user.password) throw new UnauthorizedException('Invalid credentials');
    if (!user.isActive) throw new UnauthorizedException('Account is deactivated');

    const passwordMatch = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatch) throw new UnauthorizedException('Invalid credentials');

    return this.generateTokens(user);
  }

  async sendOTP(phone: string) {
    const normalizedPhone = phone.startsWith('+') ? phone : `+91${phone}`;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await this.prisma.oTPCode.deleteMany({ where: { phone: normalizedPhone } });
    await this.prisma.oTPCode.create({
      data: { code: otp, phone: normalizedPhone, expiresAt },
    });

    const apiKey = this.config.get<string>('FAST2SMS_API_KEY');
    if (apiKey) {
      try {
        await axios.post(
          'https://www.fast2sms.com/dev/bulkV2',
          {
            variables_values: otp,
            route: 'otp',
            numbers: normalizedPhone.replace('+91', ''),
          },
          { headers: { authorization: apiKey } },
        );
      } catch (e) {
        console.error('Fast2SMS error:', e?.response?.data || e.message);
        throw new BadRequestException('Failed to send OTP. Please try again.');
      }
    } else {
      // Dev fallback: log to console
      console.log(`[DEV] OTP for ${normalizedPhone}: ${otp}`);
    }

    return { message: 'OTP sent successfully', phone: normalizedPhone };
  }

  async verifyOTP(dto: VerifyOtpDto) {
    const normalizedPhone = dto.phone.startsWith('+') ? dto.phone : `+91${dto.phone}`;

    const otpRecord = await this.prisma.oTPCode.findFirst({
      where: {
        phone: normalizedPhone,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpRecord || otpRecord.code !== dto.otp) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    await this.prisma.oTPCode.update({ where: { id: otpRecord.id }, data: { used: true } });

    let user = await this.prisma.user.findUnique({ where: { phone: normalizedPhone } });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          phone: normalizedPhone,
          firstName: 'User',
          lastName: normalizedPhone.slice(-4),
          provider: 'PHONE',
          phoneVerified: true,
          verificationStatus: 'PHONE_VERIFIED',
        },
      });
    } else {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { phoneVerified: true, verificationStatus: 'PHONE_VERIFIED' },
      });
    }

    return this.generateTokens(user);
  }

  async googleLogin(googleUser: any) {
    let user = await this.prisma.user.findFirst({
      where: { OR: [{ googleId: googleUser.googleId }, { email: googleUser.email }] },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: googleUser.email,
          firstName: googleUser.firstName,
          lastName: googleUser.lastName,
          avatar: googleUser.avatar,
          googleId: googleUser.googleId,
          provider: 'GOOGLE',
          emailVerified: true,
          verificationStatus: 'EMAIL_VERIFIED',
        },
      });
    } else if (!user.googleId) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { googleId: googleUser.googleId, emailVerified: true },
      });
    }

    return this.generateTokens(user);
  }

  async refreshToken(token: string) {
    const stored = await this.prisma.refreshToken.findUnique({ where: { token } });
    if (!stored || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.prisma.user.findUnique({ where: { id: stored.userId } });
    if (!user) throw new UnauthorizedException('User not found');

    await this.prisma.refreshToken.delete({ where: { token } });
    return this.generateTokens(user);
  }

  async logout(userId: string, refreshToken?: string) {
    if (refreshToken) {
      await this.prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
    } else {
      await this.prisma.refreshToken.deleteMany({ where: { userId } });
    }
    return { message: 'Logged out successfully' };
  }

  async generateTokens(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };

    const accessToken = this.jwtService.sign(payload);
    const refreshTokenValue = crypto.randomBytes(40).toString('hex');

    await this.prisma.refreshToken.create({
      data: {
        token: refreshTokenValue,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const { password, ...safeUser } = user;

    return {
      accessToken,
      refreshToken: refreshTokenValue,
      user: safeUser,
    };
  }

  async validateUser(userId: string) {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }
}
