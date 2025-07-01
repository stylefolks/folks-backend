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
  avatarUrl?: string;

  @IsOptional()
  externalLinks?: Record<string, any>;
}
