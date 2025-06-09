import { IsString, IsOptional } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  postId: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  parentId?: string;
}
