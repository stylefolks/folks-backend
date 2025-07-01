import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CrewStatus } from 'src/prisma/crew-status';
import { SponsorshipType } from 'src/prisma/sponsorship-type';
import { UserRole } from 'src/prisma/user-role';
import { ValidateSponsorshipDto } from './dto/validate-sponsorship.dto';
import { CreateSponsorshipDto } from './dto/create-sponsorship.dto';

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

  async create(dto: CreateSponsorshipDto, userId: string) {
    await this.validate(dto, userId);

    // In a real implementation we would create a Stripe Checkout session here.
    // Returning a static url allows tests to run without external network calls.
    return { url: 'https://example.com/checkout-session' };
  }

  async handleWebhook(event: any) {
    if (event && event.type === 'checkout.session.completed') {
      const session = event.data?.object as any;
      const crewId = session?.metadata?.crewId as string | undefined;
      const sponsorId = session?.metadata?.sponsorId as string | undefined;
      const amount = session?.amount_total as number | undefined;

      if (crewId && sponsorId && amount) {
        await this.prisma.sponsorship.create({
          data: {
            crewId,
            sponsorId,
            amount,
            type: SponsorshipType.ONETIME,
            startedAt: new Date(),
          },
        });
      }
    }

    return { received: true };
  }
}
