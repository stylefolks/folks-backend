import { IsOptional, IsString } from 'class-validator';

export class UpdateCrewDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  coverImage?: string;

  @IsOptional()
  links?: Record<string, any>;

  @IsOptional()
  @IsString()
  sponsorImage?: string;

  @IsOptional()
  @IsString()
  sponsorUrl?: string;
}
