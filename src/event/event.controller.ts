import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CreateEventDto } from './dto';
import { EventService } from './event.service';

@Controller()
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @UseGuards(JwtAuthGuard)
  @Post('crew/:crewId/events')
  create(
    @Param('crewId') crewId: string,
    @Body() dto: CreateEventDto,
  ) {
    return this.eventService.create(crewId, dto);
  }

  @Get('crew/:crewId/events')
  findCrewEvents(@Param('crewId') crewId: string) {
    return this.eventService.findCrewEvents(crewId);
  }

  @Get('events/:id')
  findOne(@Param('id') id: string) {
    return this.eventService.findOne(id);
  }
}
