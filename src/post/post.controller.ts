import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { RequestWithUser } from 'src/auth/types/request-with-user';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreatePostDto, @Request() req: RequestWithUser) {
    return this.postService.createPost(dto, req.user.userId);
  }
}
