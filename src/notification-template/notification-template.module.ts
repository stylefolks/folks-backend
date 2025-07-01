import { Module } from '@nestjs/common';
import { NotificationTemplateService } from './notification-template.service';
import { NotificationTemplateController } from './notification-template.controller';

@Module({
  controllers: [NotificationTemplateController],
  providers: [NotificationTemplateService],
})
export class NotificationTemplateModule {}
