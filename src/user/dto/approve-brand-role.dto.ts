import { IsString } from 'class-validator';

export class ApproveBrandRoleDto {
  @IsString()
  userId: string;
}
