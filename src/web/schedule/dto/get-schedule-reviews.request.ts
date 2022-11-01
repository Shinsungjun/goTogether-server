import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class GetScheduleReviewsRequest {
  @ApiProperty({
    example: 1,
    description: '일정 아이디',
  })
  @IsNumber()
  scheduleId: number;
}
