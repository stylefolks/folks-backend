import { UserDto } from './post.dto';

export interface PostDetailCommentDto {
  id: string;
  author: UserDto;
  createdAt: string;
  content: string;
}
