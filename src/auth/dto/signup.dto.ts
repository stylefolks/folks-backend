import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  @ApiProperty({ example: 'test@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'username' })
  @IsString()
  username: string;

  @ApiProperty({ minLength: 4 })
  @MinLength(4)
  password: string;
}
