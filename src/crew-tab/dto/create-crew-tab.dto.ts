import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { CrewTabType } from 'src/prisma/crew-tab-type';

export class CreateCrewTabDto {
  @IsString()
  title: string;

  @IsEnum(CrewTabType)
  type: CrewTabType;

  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;

  @IsInt()
  order: number;

  @IsOptional()
  @IsString()
  hashtag?: string;
}
