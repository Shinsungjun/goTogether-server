import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetDuplicatePhoneNumberRequest {
  @ApiProperty({
    example: '010-4793-7231',
    description: '전화번호',
  })
  @IsString()
  phoneNumber: string;
}
