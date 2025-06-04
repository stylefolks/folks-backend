import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCrewDto } from './dto/create-crew.dto';

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
}
