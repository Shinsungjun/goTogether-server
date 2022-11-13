import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetPasswordRequest {
  @ApiProperty({
    example: 'hyunbin7231',
    description: '비밀번호',
  })
  @IsString()
  password: string;
}
