import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CrewPermissionService } from 'src/crew-permission/crew-permission.service';
import { CrewPermissionAction } from 'src/prisma/crew-permission-action';
import { CrewMemberRole } from 'src/prisma/crew-member-role';

@Injectable()
export class CrewMemberService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly permission: CrewPermissionService,
  ) {}

  async join(crewId: string, userId: string, roleId: number) {
    return this.prisma.crewMember.create({
      data: { crewId, userId, roleId },
    });
  }

  async listUserCrews(userId: string) {
    return this.prisma.crewMember.findMany({
      where: { userId },
      include: { crew: true },
    });
  }

  listCrewMembers(crewId: string) {
    return this.prisma.crewMember.findMany({
      where: { crewId },
      include: {
        user: { select: { id: true, username: true } },
      },
    });
  }

  async changeRole(
    crewId: string,
    targetId: string,
    role: CrewMemberRole,
    actorId: string,
  ) {
    const allowed = await this.permission.hasPermission(
      crewId,
      actorId,
      CrewPermissionAction.MANAGE_MEMBER,
    );
    if (!allowed) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    const member = await this.prisma.crewMember.findUnique({
      where: { crewId_userId: { crewId, userId: targetId } },
    });
    if (!member) {
      throw new HttpException('Member not found', HttpStatus.NOT_FOUND);
    }

    return this.prisma.crewMember.update({
      where: { crewId_userId: { crewId, userId: targetId } },
      data: { role },
    });
  }

  async removeMember(crewId: string, targetId: string, actorId: string) {
    const allowed = await this.permission.hasPermission(
      crewId,
      actorId,
      CrewPermissionAction.MANAGE_MEMBER,
    );
    if (!allowed) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    const member = await this.prisma.crewMember.findUnique({
      where: { crewId_userId: { crewId, userId: targetId } },
    });
    if (!member) {
      throw new HttpException('Member not found', HttpStatus.NOT_FOUND);
    }

    await this.prisma.crewMember.delete({
      where: { crewId_userId: { crewId, userId: targetId } },
    });
  }
}
