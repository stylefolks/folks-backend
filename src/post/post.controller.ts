// src/post/post.controller.ts
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RequestWithUser } from 'src/common/types/request-with-user';
import { GetPostsDto } from './dto/get-posts.dto';

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
}
