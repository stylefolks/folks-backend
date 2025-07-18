import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserDto } from 'src/post/dto/post.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserStatus } from 'src/prisma/user-status';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  private emailCodes = new Map<string, { code: string; expires: Date }>();

  async login(email: string, password: string) {
    const user = await this.prisma.user.findFirst({ where: { email } });
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.NOT_FOUND);
    }
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    if (user.status !== UserStatus.ACTIVE) {
      throw new HttpException('Email not verified', HttpStatus.FORBIDDEN);
    }
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);
    // RefreshToken 발급 및 저장
    const refreshToken = uuidv4();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7일
    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt,
      },
    });
    const userRes: Pick<UserDto, 'id' | 'email' | 'username' | 'role'> = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };
    return {
      user: userRes,
      accessToken,
      refreshToken,
    };
  }
  // RefreshToken으로 accessToken 재발급
  async refresh(refreshToken: string) {
    const tokenRecord = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });
    if (
      !tokenRecord ||
      tokenRecord.expiresAt < new Date() ||
      !tokenRecord.user
    ) {
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }
    const payload = { sub: tokenRecord.user.id, email: tokenRecord.user.email };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }

  // 로그아웃 시 RefreshToken 삭제
  async logout(refreshToken: string) {
    await this.prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });
    return { loggedOut: true };
  }

  async signup(email: string, username: string, password: string) {
    //TLDR; 암호화된 비밀번호 저장(saltRounds 10: salt붙여 진행하는 해시 레벨을 의미)
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.prisma.user.create({
      data: {
        email,
        username,
        passwordHash: hashedPassword,
        status: UserStatus.INACTIVE,
        role: 'USER',
      },
    });
  }

  requestEmailVerification(email: string) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000);
    this.emailCodes.set(email, { code, expires });
    return { code };
  }

  async verifyEmail(email: string, code: string) {
    const record = this.emailCodes.get(email);
    if (!record || record.code !== code || record.expires < new Date()) {
      throw new HttpException(
        'Invalid verification code',
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.prisma.user.update({
      where: { email },
      data: { status: UserStatus.ACTIVE },
    });
    this.emailCodes.delete(email);
    return { verified: true };
  }

  async findById(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
    });
  }
}
