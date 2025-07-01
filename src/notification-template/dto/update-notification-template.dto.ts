import { IsOptional, IsString } from 'class-validator';

export class UpdateNotificationTemplateDto {
  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  message?: string;
}
