import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RequestWithUser } from 'src/common/types/request-with-user';
import { CreateCrewTabDto } from './dto/create-crew-tab.dto';
import { UpdateCrewTabDto } from './dto/update-crew-tab.dto';
import { CrewTabService } from './crew-tab.service';

@Controller('crew')
export class CrewTabController {
  constructor(private readonly service: CrewTabService) {}

  @Get(':crewId/tabs')
  list(@Param('crewId') crewId: string) {
    return this.service.findCrewTabs(crewId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':crewId/tabs')
  create(
    @Param('crewId') crewId: string,
    @Body() dto: CreateCrewTabDto,
    @Req() _req: RequestWithUser,
  ) {
    return this.service.create(crewId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('tabs/:id')
  update(@Param('id') id: string, @Body() dto: UpdateCrewTabDto) {
    return this.service.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('tabs/:id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
