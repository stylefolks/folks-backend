import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEventDto } from './dto';

@Injectable()
export class EventService {
  constructor(private readonly prisma: PrismaService) {}

  create(crewId: string, dto: CreateEventDto) {
    return this.prisma.event.create({
      data: {
        crewId,
        title: dto.title,
        date: new Date(dto.date),
        location: dto.location,
        link: dto.link,
      },
    });
  }

  findCrewEvents(crewId: string) {
    return this.prisma.event.findMany({
      where: { crewId },
      orderBy: { date: 'asc' },
    });
  }

  findOne(id: string) {
    return this.prisma.event.findUnique({ where: { id } });
  }
}
