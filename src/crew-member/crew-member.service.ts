import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CrewService } from 'src/crew/crew.service';

@Injectable()
export class CrewMemberService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly crewService: CrewService,
  ) {}

  async join(crewId: string, userId: string, roleId: number) {
    return this.prisma.crewMember.create({
      data: { crewId, userId, roleId },
    });
  }

  async leave(crewId: string, userId: string) {
    await this.prisma.crewMember
      .delete({
        where: { crewId_userId: { crewId, userId } },
      })
      .catch(() => {});

    await this.crewService.handleOwnerLeave(crewId, userId);
  }

  async listUserCrews(userId: string) {
    return this.prisma.crewMember.findMany({
      where: { userId },
      include: { crew: true },
    });
  }
}
