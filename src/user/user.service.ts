import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserStatus } from 'src/prisma/user-status';
import { UserRole } from 'src/prisma/user-role';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  getUserById(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        avatarUrl: true,
        bio: true,
        role: true,
        status: true,
      },
    });
  }

  async updateUser(userId: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: updateUserDto,
    });
  }

  async deleteUser(userId: string) {
    await this.prisma.user.delete({ where: { id: userId } });
  }

  async updateStatus(userId: string, status: UserStatus) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { status },
    });
  }

  async requestBrandRole(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { status: UserStatus.INACTIVE },
    });
  }

  async approveBrandRole(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { role: UserRole.BRAND, status: UserStatus.ACTIVE },
    });
  }
}
