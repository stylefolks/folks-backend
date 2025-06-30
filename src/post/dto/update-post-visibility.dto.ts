import { IsEnum } from 'class-validator';
import { PostVisibility } from 'src/prisma/post-visibility';

export class UpdatePostVisibilityDto {
  @IsEnum(PostVisibility)
  visibility: PostVisibility;
}
