import {
  IsString,
  IsEnum,
  IsBoolean,
  IsOptional,
  IsObject,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PostType } from 'src/prisma/post-type';

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
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  tagNames?: string[]; // 태그 이름 배열로 전달

  @IsOptional()
  @IsString()
  crewId?: string;
}
