import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CrewStatus } from 'src/prisma/crew-status';
import { SponsorshipType } from 'src/prisma/sponsorship-type';
import { UserRole } from 'src/prisma/user-role';
import { ValidateSponsorshipDto } from './dto/validate-sponsorship.dto';

@Injectable()
export class SponsorshipService {
  constructor(private readonly prisma: PrismaService) {}

  async validate(dto: ValidateSponsorshipDto, userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (
      !user ||
      ![UserRole.BRAND, UserRole.USER].includes(user.role as UserRole)
    ) {
      throw new BadRequestException('Invalid user');
    }

    const crew = await this.prisma.crew.findUnique({
      where: { id: dto.crewId },
    });
    if (!crew || crew.status !== CrewStatus.ACTIVE) {
      throw new BadRequestException('Invalid crew');
    }

    const existing = await this.prisma.sponsorship.findFirst({
      where: {
        sponsorId: userId,
        crewId: dto.crewId,
        type: SponsorshipType.MONTHLY,
        endedAt: null,
      },
    });
    if (existing) {
      throw new BadRequestException('Already sponsored');
    }

    if (dto.amount < 1000 || dto.amount > 1000000) {
      throw new BadRequestException('Invalid amount');
    }

    return { valid: true };
  }
}
