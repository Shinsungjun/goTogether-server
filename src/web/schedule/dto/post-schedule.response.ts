import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsObject } from 'class-validator';
import { BaseResponse } from 'config/base.response';

class PostScheduleResultData {
  @ApiProperty({
    example: 1,
    description: '생성된 일정 아이디',
  })
  @IsNumber()
  scheduleId: number;
}

export abstract class PostScheduleResponse extends BaseResponse {
  @ApiProperty({
    description: 'result 객체',
  })
  @IsObject()
  result: PostScheduleResultData;
}
