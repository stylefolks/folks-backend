import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async signup(email: string, username: string, password: string) {
    return this.prisma.user.create({
      data: {
        email,
        username,
        password,
      },
    });
  }

  async login(email: string, password: string) {
    return this.prisma.user.findFirst({
      where: {
        email,
        password,
      },
    });
  }
}
