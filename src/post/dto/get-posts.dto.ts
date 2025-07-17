import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsEnum,
  IsArray,
  IsNumberString,
} from 'class-validator';

import { Type } from 'class-transformer';
import { PostType } from 'src/prisma/post-type';
// import { ContentDto } from './content.dto'; // content 필드가 있다면 적용

export class GetPostsDto {
  @ApiPropertyOptional({
    type: String,
    description: '쿼리스트링이므로 문자열로 받고 transform 필요',
  })
  @IsOptional()
  @IsNumberString()
  take?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  cursor?: string;

  @ApiPropertyOptional({ enum: PostType })
  @IsOptional()
  @IsEnum(PostType)
  postType?: PostType;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  tags?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  crewId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  mention?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  query?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  authorId?: string;
}
