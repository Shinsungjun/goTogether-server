import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsObject, IsString } from 'class-validator';
import { BaseResponse } from 'config/base.response';

class UserInfo {
  @ApiProperty({
    example: 1,
    description: '유저 아이디',
  })
  @IsNumber()
  userId: number;

  @ApiProperty({
    example: '핀',
    description: '유저 닉네임',
  })
  @IsString()
  nickName: string;

  @ApiProperty({
    example: 'harry7231',
    description: '유저 계정 아이디',
  })
  @IsString()
  userName: string;
}

class GetUserResultData {
  @ApiProperty({
    example: {
      userId: 4,
      nickName: '핀',
      userName: 'harry7231',
    },
    description: '유저 정보 객체',
    type: UserInfo,
  })
  @IsObject()
  user: UserInfo;
}

export abstract class GetUserResponse extends BaseResponse {
  @ApiProperty({
    description: 'result 객체',
  })
  @IsObject()
  result: GetUserResultData;
}
