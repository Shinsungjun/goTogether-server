import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsObject } from 'class-validator';
import { BaseResponse } from 'config/base.response';

class CompareIdPhoneNumberResultData {
  @ApiProperty({
    example: 1,
    description: '유저 아이디',
  })
  @IsNumber()
  userId: number;
}

export abstract class CompareIdPhoneNumberResponse extends BaseResponse {
  @ApiProperty({
    description: 'result 객체',
    type: CompareIdPhoneNumberResultData,
  })
  @IsObject()
  result: CompareIdPhoneNumberResultData;
}
