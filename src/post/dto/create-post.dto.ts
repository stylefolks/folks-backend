import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
import { ContentDto } from './content.dto';

export class CreatePostDto {
  @ApiProperty({ enum: PostType })
  @IsEnum(PostType)
  type: PostType;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ type: ContentDto })
  @IsObject()
  @Type(() => ContentDto)
  content: ContentDto;

  @ApiPropertyOptional({ type: 'boolean' })
  @IsOptional()
  @IsBoolean()
  isDraft?: boolean;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  tagNames?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  crewId?: string;
}
