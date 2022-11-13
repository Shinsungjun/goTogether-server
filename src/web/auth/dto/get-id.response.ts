import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsString } from 'class-validator';
import { BaseResponse } from 'config/base.response';

class GetIdResultData {
  @ApiProperty({
    example: 'harry7231',
    description: '회원 아이디',
  })
  @IsString()
  userName: string;

  @ApiProperty({
    example: '2022.01.01',
    description: '가입일',
  })
  @IsString()
  createdAt: string;
}

export abstract class GetIdResponse extends BaseResponse {
  @ApiProperty({
    description: 'result 객체',
    type: GetIdResultData,
  })
  @IsObject()
  result: GetIdResultData;
}
