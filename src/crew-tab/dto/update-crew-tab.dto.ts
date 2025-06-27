import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { CrewTabType } from 'src/prisma/crew-tab-type';

export class UpdateCrewTabDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsEnum(CrewTabType)
  type?: CrewTabType;

  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;

  @IsOptional()
  @IsInt()
  order?: number;

  @IsOptional()
  @IsString()
  hashtag?: string;
}
