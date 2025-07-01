import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRole } from 'src/prisma/user-role';
import { AdCampaignStatus } from 'src/prisma/ad-campaign-status';
import { CreateAdCampaignDto } from './dto/create-ad-campaign.dto';

@Injectable()
export class AdCampaignService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAdCampaignDto, brandId: string) {
    const brand = await this.prisma.user.findUnique({ where: { id: brandId } });
    if (!brand || brand.role !== UserRole.BRAND) {
      throw new BadRequestException('Only brands can create ad campaigns');
    }

    const { crewId, content, bannerUrl, budget, startsAt, endsAt } = dto;
    return this.prisma.adCampaign.create({
      data: {
        brandId,
        crewId,
        content,
        bannerUrl,
        budget,
        startsAt: new Date(startsAt),
        endsAt: new Date(endsAt),
        status: AdCampaignStatus.PENDING,
      },
    });
  }

  async updateStatus(id: string, status: AdCampaignStatus) {
    const campaign = await this.prisma.adCampaign.findUnique({ where: { id } });
    if (!campaign) throw new NotFoundException('Campaign not found');

    if (!this.isValidTransition(campaign.status as AdCampaignStatus, status)) {
      throw new BadRequestException('Invalid status transition');
    }

    return this.prisma.adCampaign.update({ where: { id }, data: { status } });
  }

  isValidTransition(current: AdCampaignStatus, next: AdCampaignStatus) {
    const map: Record<AdCampaignStatus, AdCampaignStatus[]> = {
      [AdCampaignStatus.PENDING]: [AdCampaignStatus.APPROVED, AdCampaignStatus.REJECTED],
      [AdCampaignStatus.APPROVED]: [],
      [AdCampaignStatus.REJECTED]: [],
    };
    return map[current]?.includes(next);
  }
}
