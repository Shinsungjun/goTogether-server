import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsObject, IsString } from 'class-validator';
import { BaseResponse } from 'config/base.response';

class PostUserResultData {
  @ApiProperty({
    example: 1,
    description: '생성된 유저 아이디',
  })
  @IsNumber()
  createdUserId: number;

  @ApiProperty({
    example: '핀',
    description: '닉네임',
  })
  @IsString()
  nickName: string;

  @ApiProperty({
    example: '010-4793-7231',
    description: '전화번호',
  })
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    example: 'harry7231',
    description: '유저 아이디',
  })
  @IsString()
  userName: string;

  @ApiProperty({
    example: 'asdjkbfasklqdalsdkalsdlajs',
    description: 'jwt',
  })
  @IsString()
  jwt: string;
}

export abstract class PostUserResponse extends BaseResponse {
  @ApiProperty({
    description: 'result 객체',
  })
  @IsObject()
  result: PostUserResultData;
}
