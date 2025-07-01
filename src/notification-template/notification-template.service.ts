import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNotificationTemplateDto } from './dto/create-notification-template.dto';
import { UpdateNotificationTemplateDto } from './dto/update-notification-template.dto';

@Injectable()
export class NotificationTemplateService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateNotificationTemplateDto) {
    return this.prisma.notificationTemplate.create({ data: dto });
  }

  findAll() {
    return this.prisma.notificationTemplate.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: string) {
    return this.prisma.notificationTemplate.findUnique({ where: { id } });
  }

  update(id: string, dto: UpdateNotificationTemplateDto) {
    return this.prisma.notificationTemplate.update({ where: { id }, data: dto });
  }

  remove(id: string) {
    return this.prisma.notificationTemplate.delete({ where: { id } });
  }
}
