import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetDuplicateIdRequest {
  @ApiProperty({
    example: 'harry7231',
    description: '아이디',
  })
  @IsString()
  userName: string;
}
