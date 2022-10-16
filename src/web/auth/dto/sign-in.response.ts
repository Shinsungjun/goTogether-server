import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsObject, IsString } from 'class-validator';
import { BaseResponse } from 'config/base.response';

class SignInResultData {
  @ApiProperty({
    example: 1,
    description: '유저 아이디',
  })
  @IsNumber()
  userId: number;

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
    example: 'asdasaonfoanfnalsndlkasndklans',
    description: 'jwt',
  })
  @IsString()
  jwt: string;
}

export abstract class SignInResponse extends BaseResponse {
  @ApiProperty({
    description: 'result 객체',
  })
  @IsObject()
  result: SignInResultData;
}
