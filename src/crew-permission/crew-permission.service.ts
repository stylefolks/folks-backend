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
    // Permission system not implemented yet
    return false;
  }
}
