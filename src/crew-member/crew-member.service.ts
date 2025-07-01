import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CrewService } from 'src/crew/crew.service';
import { CrewMemberRole } from 'src/prisma/crew-member-role';

@Injectable()
export class CrewMemberService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly crewService: CrewService,
  ) {}

  async join(crewId: string, userId: string) {
    return this.prisma.crewMember.create({
      data: { crewId, userId, role: CrewMemberRole.MEMBER },
    });
  }

  listMembers(crewId: string) {
    return this.prisma.crewMember.findMany({
      where: { crewId },
      include: {
        user: {
          select: { id: true, username: true, avatarUrl: true },
        },
      },
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

  updateRole(crewId: string, userId: string, role: CrewMemberRole) {
    return this.prisma.crewMember.update({
      where: { crewId_userId: { crewId, userId } },
      data: { role },
    });
  }

  async removeMember(crewId: string, userId: string) {
    await this.prisma.crewMember.delete({
      where: { crewId_userId: { crewId, userId } },
    });
    await this.crewService.handleOwnerLeave(crewId, userId);
  }
}
