import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateTopicDto {
  @IsString()
  hashtag: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tabIds?: string[];
}
