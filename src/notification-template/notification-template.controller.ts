import { Body, Controller, Get, Post } from '@nestjs/common';
import { NotificationTemplateService } from './notification-template.service';
import { CreateNotificationTemplateDto } from './dto/create-notification-template.dto';

@Controller('notification-templates')
export class NotificationTemplateController {
  constructor(private readonly service: NotificationTemplateService) {}

  @Post()
  create(@Body() dto: CreateNotificationTemplateDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
