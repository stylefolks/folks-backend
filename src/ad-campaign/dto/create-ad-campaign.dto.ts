import { IsString, IsInt, IsDateString } from 'class-validator';

export class CreateAdCampaignDto {
  @IsString()
  crewId: string;

  @IsString()
  content: string;

  @IsString()
  bannerUrl: string;

  @IsInt()
  budget: number;

  @IsDateString()
  startsAt: string;

  @IsDateString()
  endsAt: string;
}
