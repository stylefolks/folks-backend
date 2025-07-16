import { ApiProperty } from '@nestjs/swagger';

export class ContentDto {
  @ApiProperty({ example: 'Example content' })
  text: string;
  // 필요한 경우 추가 필드 정의
}
