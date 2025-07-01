import { IsString } from 'class-validator';

export class CreateNotificationTemplateDto {
  @IsString()
  code: string;

  @IsString()
  message: string;
}
