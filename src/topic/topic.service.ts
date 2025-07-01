import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTopicDto } from './dto/create-topic.dto';

@Injectable()
export class TopicService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTopicDto) {
    const topic = await this.prisma.topic.create({
      data: { hashtag: dto.hashtag },
    });

    if (dto.tabIds?.length) {
      await this.prisma.crewTab.updateMany({
        where: { id: { in: dto.tabIds } },
        data: { topicId: topic.id, hashtag: dto.hashtag },
      });
    }

    return topic;
  }
}
