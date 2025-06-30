import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PostVisibility } from 'src/prisma/post-visibility';
import { ReportTargetType } from 'src/prisma/report-target-type';
import { ReportStatus } from 'src/prisma/report-status';
import { UserStatus } from 'src/prisma/user-status';
import { CreateReportDto } from './dto/create-report.dto';

@Injectable()
export class ReportService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateReportDto, reporterId: string) {
    const report = await this.prisma.contentReport.create({
      data: {
        reporterId,
        targetType: dto.targetType,
        targetId: dto.targetId,
        reason: dto.reason,
      },
    });

    if (dto.targetType === ReportTargetType.POST) {
      const count = await this.prisma.contentReport.count({
        where: { targetType: ReportTargetType.POST, targetId: dto.targetId },
      });

      if (count >= 5) {
        await this.prisma.post.update({
          where: { id: dto.targetId },
          data: { visibility: PostVisibility.REPORTED, isFlagged: true },
        });
      }
    }

    return report;
  }

  findByStatus(status: ReportStatus = ReportStatus.PENDING) {
    return this.prisma.contentReport.findMany({ where: { status } });
  }

  async resolve(id: string) {
    const report = await this.prisma.contentReport.update({
      where: { id },
      data: { status: ReportStatus.REVIEWED },
    });

    if (report.targetType === ReportTargetType.USER) {
      const count = await this.prisma.contentReport.count({
        where: {
          targetType: ReportTargetType.USER,
          targetId: report.targetId,
          status: ReportStatus.REVIEWED,
        },
      });
      if (count >= 10) {
        await this.prisma.user.update({
          where: { id: report.targetId },
          data: { status: UserStatus.BANNED },
        });
      }
    }

    return report;
  }
}
