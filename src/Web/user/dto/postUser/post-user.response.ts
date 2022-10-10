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
