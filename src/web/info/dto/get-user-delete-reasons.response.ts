import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsObject } from 'class-validator';
import { BaseResponse } from 'config/base.response';

class UserDeleteReason {
  @ApiProperty({
    example: 1,
    description: '탈퇴 사유 아이디',
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    example: '새로운 계정이 필요해요.',
    description: '탈퇴 사유',
  })
  name: string;
}

class GetUserDeleteReasonResultData {
  @ApiProperty({
    example: [
      {
        id: 1,
        name: '새로운 계정이 필요해요',
      },
      {
        id: 2,
        name: '시간을 너무 많이 뺏어가요',
      },
      {
        id: 3,
        name: '저에게 불필요한 기능이 많아요',
      },
      {
        id: 4,
        name: '사용하기가 불편해요',
      },
      {
        id: 5,
        name: '기타',
      },
    ],
    description: '탈퇴 사유 객체 리스트',
    isArray: true,
    type: UserDeleteReason,
  })
  @IsArray()
  userDeleteReasons: Array<UserDeleteReason>;
}

export abstract class GetUserDeleteReasonsResponse extends BaseResponse {
  @ApiProperty({
    description: 'result 객체',
  })
  @IsObject()
  result: GetUserDeleteReasonResultData;
}
