import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCrewDto } from './dto/create-crew.dto';
import { UpdateCrewDto } from './dto/update-crew.dto';
import { CrewStatus } from 'src/prisma/crew-status';
import { CrewMemberRole } from 'src/prisma/crew-member-role';
import { UserRole } from 'src/prisma/user-role';

@Injectable()
export class CrewService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCrewDto, ownerId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: ownerId } });
    if (!user || user.role !== UserRole.INFLUENCER) {
      throw new HttpException(
        'Only influencers can create crew',
        HttpStatus.BAD_REQUEST,
      );
    }

    const existing = await this.prisma.crew.findFirst({ where: { ownerId } });
    if (existing) {
      throw new HttpException(
        'User already has a crew',
        HttpStatus.BAD_REQUEST,
      );
    }

    const { name, description, avatarUrl, externalLinks } = dto;
    return this.prisma.crew.create({
      data: {
        name,
        description,
        avatarUrl,
        externalLinks,
        ownerId,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.crew.findUnique({
      where: { id },
      include: {
        owner: {
          select: { id: true, username: true },
        },
      },
    });
  }

  async update(id: string, dto: UpdateCrewDto, userId: string) {
    const crew = await this.prisma.crew.findUnique({ where: { id } });
    if (!crew || crew.ownerId !== userId) {
      throw new HttpException('Crew not found', HttpStatus.NOT_FOUND);
    }

    return this.prisma.crew.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: string, userId: string) {
    const crew = await this.prisma.crew.findUnique({ where: { id } });
    if (!crew || crew.ownerId !== userId) {
      throw new HttpException('Crew not found', HttpStatus.NOT_FOUND);
    }

    await this.prisma.crew.delete({ where: { id } });
  }

  async updateStatus(id: string, status: CrewStatus, userId: string) {
    const crew = await this.prisma.crew.findUnique({ where: { id } });
    if (!crew || crew.ownerId !== userId) {
      throw new HttpException('Crew not found', HttpStatus.NOT_FOUND);
    }

    return this.prisma.crew.update({ where: { id }, data: { status } });
  }

  async transferOwnership(id: string, newOwnerId: string, userId: string) {
    const crew = await this.prisma.crew.findUnique({ where: { id } });
    if (!crew || crew.ownerId !== userId) {
      throw new HttpException('Crew not found', HttpStatus.NOT_FOUND);
    }

    const membership = await this.prisma.crewMember.findUnique({
      where: { crewId_userId: { crewId: id, userId: newOwnerId } },
    });

    if (!membership) {
      throw new HttpException(
        'New owner must be a crew member',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.prisma.crewMember
      .update({
        where: { crewId_userId: { crewId: id, userId } },
        data: { role: CrewMemberRole.MANAGER },
      })
      .catch(() => {});

    await this.prisma.crewMember.update({
      where: { crewId_userId: { crewId: id, userId: newOwnerId } },
      data: { role: CrewMemberRole.OWNER },
    });

    return this.prisma.crew.update({
      where: { id },
      data: { ownerId: newOwnerId },
    });
  }

  async handleOwnerLeave(crewId: string, userId: string) {
    const crew = await this.prisma.crew.findUnique({ where: { id: crewId } });
    if (!crew || crew.ownerId !== userId) return;

    const nextMember = await this.prisma.crewMember.findFirst({
      where: { crewId },
      orderBy: { joinedAt: 'asc' },
    });

    if (!nextMember) {
      await this.prisma.crew.update({
        where: { id: crewId },
        data: { status: CrewStatus.HIDDEN },
      });
      return;
    }

    await this.prisma.crew.update({
      where: { id: crewId },
      data: { ownerId: nextMember.userId },
    });

    await this.prisma.crewMember.update({
      where: {
        crewId_userId: { crewId, userId: nextMember.userId },
      },
      data: { role: CrewMemberRole.OWNER },
    });
  }
}
