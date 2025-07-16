import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { PostVisibility } from 'src/prisma/post-visibility';

export class UpdatePostVisibilityDto {
  @ApiProperty({ enum: PostVisibility })
  @IsEnum(PostVisibility)
  visibility: PostVisibility;
}
