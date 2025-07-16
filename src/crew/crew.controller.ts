import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RequestWithUser } from 'src/common/types/request-with-user';
import { CreateCrewDto } from './dto/create-crew.dto';
import { CrewService } from './crew.service';

@ApiTags('crew')
@Controller('crew')
export class CrewController {
  constructor(private readonly crewService: CrewService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateCrewDto, @Req() req: RequestWithUser) {
    return this.crewService.create(dto, req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.crewService.findOne(id);
  }
}
