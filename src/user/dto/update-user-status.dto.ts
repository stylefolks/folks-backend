import { IsEnum } from 'class-validator';
import { UserStatus } from 'src/prisma/user-status';

export class UpdateUserStatusDto {
  @IsEnum(UserStatus)
  status: UserStatus;
}
