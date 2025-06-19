import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCrewDto } from './dto/create-crew.dto';
import { UpdateCrewDto } from './dto/update-crew.dto';

@Injectable()
export class CrewService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateCrewDto, ownerId: string) {
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
