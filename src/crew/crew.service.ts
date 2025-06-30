import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCrewDto } from './dto/create-crew.dto';
import { UpdateCrewDto } from './dto/update-crew.dto';
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

    const { name, description, coverImage, links } = dto;
    return this.prisma.crew.create({
      data: {
        name,
        description,
        coverImage,
        links,
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
}
