import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HashTag } from './dto/hash-tag.dto';

@Injectable()
export class HashtagService {
  constructor(private readonly prisma: PrismaService) {}

  async getHot(take = 10): Promise<HashTag[]> {
    const takeNum = Number(take);
    const tags = await this.prisma.hashTag.findMany({
      orderBy: { postTags: { _count: 'desc' } },
      take: takeNum,
      include: { _count: { select: { postTags: true } } },
    });
    return tags.map((tag) => ({
      name: tag.name,
      postCount: tag._count.postTags,
    }));
  }
}
