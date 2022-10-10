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
