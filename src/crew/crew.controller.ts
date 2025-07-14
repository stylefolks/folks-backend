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
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RequestWithUser } from 'src/common/types/request-with-user';
import { CreateCrewDto } from './dto/create-crew.dto';
import { CrewService } from './crew.service';
import { UpdateCrewDto } from './dto/update-crew.dto';
import { PostService } from 'src/post/post.service';
import { CreatePostDto } from 'src/post/dto/create-post.dto';
import { PostType } from 'src/prisma/post-type';
import { CrewStatus } from 'src/prisma/crew-status';

@Controller('crew')
export class CrewController {
  constructor(
    private readonly crewService: CrewService,
    private readonly postService: PostService,
  ) {}

  @Get()
  list(@Query('sort') sort?: string) {
    return this.crewService.list(sort);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateCrewDto, @Req() req: RequestWithUser) {
    return this.crewService.create(dto, req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.crewService.findOne(id);
  }

  @Get(':id/posts')
  getCrewPosts(@Param('id') id: string) {
    return this.postService.getPosts({ crewId: id });
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/posts')
  createCrewPost(
    @Param('id') id: string,
    @Body() dto: CreatePostDto,
    @Req() req: RequestWithUser,
  ) {
    return this.postService.createPost(
      { ...dto, crewId: id, type: PostType.CREW },
      req.user.id,
    );
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
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: CrewStatus,
    @Req() req: RequestWithUser,
  ) {
    return this.crewService.updateStatus(id, status, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/transfer-ownership')
  transferOwnership(
    @Param('id') id: string,
    @Body('userId') newOwnerId: string,
    @Req() req: RequestWithUser,
  ) {
    return this.crewService.transferOwnership(id, newOwnerId, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.crewService.delete(id, req.user.id);
  }
}
