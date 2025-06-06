import { IsOptional, IsString } from 'class-validator';

export class CreateCrewDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  coverImage?: string;

  @IsOptional()
  links?: Record<string, any>;
}
