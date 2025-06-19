import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  Patch,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RequestWithUser } from 'src/common/types/request-with-user';
import { CreateCrewDto } from './dto/create-crew.dto';
import { CrewService } from './crew.service';
import { UpdateCrewDto } from './dto/update-crew.dto';

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

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCrewDto,
    @Req() req: RequestWithUser,
  ) {
    return this.crewService.update(id, dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.crewService.delete(id, req.user.id);
  }
}
