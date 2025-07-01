import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CreateTopicDto } from './dto/create-topic.dto';
import { TopicService } from './topic.service';

@Controller()
export class TopicController {
  constructor(private readonly service: TopicService) {}

  @UseGuards(JwtAuthGuard)
  @Post('topics')
  create(@Body() dto: CreateTopicDto) {
    return this.service.create(dto);
  }
}
