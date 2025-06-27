import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CrewPermissionService {
  constructor(private readonly prisma: PrismaService) {}

  async hasPermission(
    crewId: string,
    userId: string,
    action: string,
  ): Promise<boolean> {
    const permission = await this.prisma.crewPermission.findFirst({
      where: {
        action,
        role: {
          members: {
            some: {
              crewId,
              userId,
            },
          },
        },
      },
    });
    return !!permission;
  }
}
