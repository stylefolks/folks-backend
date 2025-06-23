import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CrewMemberService {
  constructor(private readonly prisma: PrismaService) {}

  async join(crewId: string, userId: string) {
    return this.prisma.crewMember.create({
      data: { crewId, userId },
    });
  }

  async listUserCrews(userId: string) {
    return this.prisma.crewMember.findMany({
      where: { userId },
      include: { crew: true },
    });
  }
}
