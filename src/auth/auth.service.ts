import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
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
    const user = await this.prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.NOT_FOUND);
    }

    //TLDR; 입력받은 비밀번호"와 "저장된 해시 비밀번호" 비교검증
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new HttpException('Email not verified', HttpStatus.FORBIDDEN);
    }

    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
    };
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
      throw new HttpException('Invalid verification code', HttpStatus.BAD_REQUEST);
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
