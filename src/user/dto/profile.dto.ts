import { CrewDto, PostDto as PostBase } from 'src/post/dto/post.dto';

export interface PageInfo {
  hasNextPage: boolean;
  nextCursor?: string;
  totalCount?: number;
}

export interface PostDto {
  pageInfo: PageInfo;
  posts: PostBase[];
}

export interface ProfileDto {
  id: string;
  username: string;
  bio: string;
  imageUrl: string;
  tags: string[];
  posts: PostDto;
  crews: CrewDto[];
}
