// src/post/post.controller.ts
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Query,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RequestWithUser } from 'src/common/types/request-with-user';
import { GetPostsDto } from './dto/get-posts.dto';

@ApiTags('post')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createPost(@Body() dto: CreatePostDto, @Req() req: RequestWithUser) {
    return this.postService.createPost(dto, req.user.id);
  }

  @Get()
  async getPosts(@Query() query: GetPostsDto) {
    return this.postService.getPosts(query);
  }

  @Get(':id')
  async getPost(@Param('id') id: string) {
    return this.postService.getPostById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updatePost(
    @Param('id') id: string,
    @Body() dto: UpdatePostDto,
    @Req() req: RequestWithUser,
  ) {
    return this.postService.updatePost(id, dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deletePost(@Param('id') id: string, @Req() req: RequestWithUser) {
    await this.postService.deletePost(id, req.user.id);
    return {};
  }
}
