import { IsNumberString, IsOptional } from 'class-validator';

export class GetHotDto {
  @IsOptional()
  @IsNumberString()
  take?: string;
}
