import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class VerifySMSRequest {
  @ApiProperty({
    example: '010-4793-7231',
    description: '전화번호',
  })
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    example: '123456',
    description: '인증번호',
  })
  @IsString()
  verifyCode: string;
}
