import { Controller, Get, Query } from '@nestjs/common';
import { GetHotDto } from './dto/get-hot.dto';
import { HashtagService } from './hashtag.service';

@Controller('hashtag')
export class HashtagController {
  constructor(private readonly service: HashtagService) {}

  @Get('hot')
  getHot(@Query() query: GetHotDto) {
    const take = query.take ? parseInt(query.take, 10) : 10;
    return this.service.getHot(take);
  }
}
