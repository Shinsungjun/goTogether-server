import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class PostAirlineReviewReportRequest {
  @ApiProperty({
    example: 1,
    description: '리뷰 아이디',
  })
  @IsNumber()
  reviewId: number;
}
