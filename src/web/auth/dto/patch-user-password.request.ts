import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class PatchUserPasswordRequest {
  @ApiProperty({
    example: 4,
    description: '유저 아이디',
  })
  @IsNumber()
  userId: number;

  @ApiProperty({
    example: 'hyunbin7231',
    description: '변경할 비밀번호',
  })
  @IsString()
  password: string;
}
