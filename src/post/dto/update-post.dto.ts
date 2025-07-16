import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsEnum,
  IsBoolean,
  IsObject,
  IsArray,
} from 'class-validator';

import { Type } from 'class-transformer';
import { PostType } from 'src/prisma/post-type';
import { ContentDto } from './content.dto';

export class UpdatePostDto {
  @ApiPropertyOptional({ enum: PostType })
  @IsOptional()
  @IsEnum(PostType)
  type?: PostType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ type: ContentDto })
  @IsOptional()
  @IsObject()
  @Type(() => ContentDto)
  content?: ContentDto;

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
}
