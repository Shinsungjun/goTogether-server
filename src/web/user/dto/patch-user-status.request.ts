import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class PatchUserStatusRequest {
  @ApiProperty({
    example: 1,
    description: '유저 아이디',
  })
  @IsNumber()
  userId: number;

  @ApiProperty({
    example: 1,
    description: '회원 탈퇴 사유 아이디',
  })
  @IsNumber()
  userDeleteReasonId: number;
}
