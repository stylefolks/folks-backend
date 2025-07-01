import { Module } from '@nestjs/common';
import { AdCampaignController } from './ad-campaign.controller';
import { AdCampaignService } from './ad-campaign.service';

@Module({
  controllers: [AdCampaignController],
  providers: [AdCampaignService],
})
export class AdCampaignModule {}
