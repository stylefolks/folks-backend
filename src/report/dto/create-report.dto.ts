import { IsEnum, IsString } from 'class-validator';
import { ReportTargetType } from 'src/prisma/report-target-type';
import { ReportReason } from 'src/prisma/report-reason';

export class CreateReportDto {
  @IsEnum(ReportTargetType)
  targetType: ReportTargetType;

  @IsString()
  targetId: string;

  @IsEnum(ReportReason)
  reason: ReportReason;
}
