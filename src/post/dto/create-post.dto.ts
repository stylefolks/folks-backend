import {
  IsString,
  IsEnum,
  IsBoolean,
  IsOptional,
  IsObject,
} from 'class-validator';
import { PostType } from '@prisma/client';

export class CreatePostDto {
  @IsEnum(PostType)
  type: PostType;

  @IsString()
  title: string;

  @IsObject()
  content: Record<string, any>; // ProseMirror JSON을 stringified 상태로 받는다고 가정

  @IsOptional()
  @IsBoolean()
  isDraft?: boolean;

  @IsOptional()
  tagNames?: string[]; // 태그 이름 배열로 전달
}
