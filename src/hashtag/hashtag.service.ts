import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class HashtagService {
  constructor(private readonly prisma: PrismaService) {}

  getHot(take = 10) {
    const takeNum = Number(take);
    return this.prisma.hashTag.findMany({
      orderBy: { postTags: { _count: 'desc' } },
      take: takeNum,
      include: { _count: { select: { postTags: true } } },
    });
  }
}
