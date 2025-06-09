import {
  IsOptional,
  IsString,
  IsEnum,
  IsArray,
  IsNumberString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PostType } from 'src/prisma/post-type';

export class GetPostsDto {
  @IsOptional()
  @IsNumberString()
  take?: string; // 쿼리스트링이므로 문자열로 받고 transform 필요

  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @IsEnum(PostType)
  postType?: PostType;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  tags?: string[];

  @IsOptional()
  @IsString()
  crewId?: string;
}
