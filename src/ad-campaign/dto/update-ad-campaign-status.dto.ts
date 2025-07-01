import { IsEnum } from 'class-validator';
import { AdCampaignStatus } from 'src/prisma/ad-campaign-status';

export class UpdateAdCampaignStatusDto {
  @IsEnum(AdCampaignStatus)
  status: AdCampaignStatus;
}
