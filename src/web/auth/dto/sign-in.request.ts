import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SignInRequest {
  @ApiProperty({
    example: 'harry7231',
    description: '아이디',
  })
  @IsString()
  userName: string;

  @ApiProperty({
    example: 'hyunbin7231',
    description: '비밀번호',
  })
  @IsString()
  password: string;
}
