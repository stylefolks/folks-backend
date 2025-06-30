import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RequestWithUser } from 'src/common/types/request-with-user';
import { ReportStatus } from 'src/prisma/report-status';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportService } from './report.service';

@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateReportDto, @Req() req: RequestWithUser) {
    return this.reportService.create(dto, req.user.id);
  }

  @Get()
  getPending(@Query('status') status?: ReportStatus) {
    return this.reportService.findByStatus(
      status ? (status as ReportStatus) : undefined,
    );
  }

  @Patch(':id/resolve')
  resolve(@Param('id') id: string) {
    return this.reportService.resolve(id);
  }
}
