import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCrewTabDto } from './dto/create-crew-tab.dto';
import { UpdateCrewTabDto } from './dto/update-crew-tab.dto';

@Injectable()
export class CrewTabService {
  constructor(private readonly prisma: PrismaService) {}

  create(crewId: string, dto: CreateCrewTabDto) {
    return (this.prisma as any).crewTab.create({
      data: {
        crewId,
        title: dto.title,
        type: dto.type,
        isVisible: dto.isVisible ?? true,
        order: dto.order,
        hashtag: dto.hashtag,
      },
    });
  }

  findCrewTabs(crewId: string) {
    return (this.prisma as any).crewTab.findMany({
      where: { crewId },
      orderBy: { order: 'asc' },
    });
  }

  update(id: string, dto: UpdateCrewTabDto) {
    return (this.prisma as any).crewTab.update({
      where: { id },
      data: dto,
    });
  }

  remove(id: string) {
    return (this.prisma as any).crewTab.delete({ where: { id } });
  }
}
