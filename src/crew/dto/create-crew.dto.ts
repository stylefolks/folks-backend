import { IsOptional, IsString } from 'class-validator';

export class CreateCrewDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @IsOptional()
  externalLinks?: Record<string, any>;
}
