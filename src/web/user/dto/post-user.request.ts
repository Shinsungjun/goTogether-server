import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PostUserRequest {
  @ApiProperty({
    example: '010-4793-7231',
    description: '전화번호',
  })
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    example: 'harry7231',
    description: '아이디',
  })
  @IsString()
  userName: string;

  @ApiProperty({
    example: 'hyunbin7231',
    description: '비밀번호',
  })
  @IsString()
  password: string;

  @ApiProperty({
    example: '핀',
    description: '닉네임',
  })
  @IsString()
  nickName: string;
}
