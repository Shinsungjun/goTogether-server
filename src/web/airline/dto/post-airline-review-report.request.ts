import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class PostAirlineReviewReportRequest {
  @ApiProperty({
    example: 1,
    description: '항공사 리뷰 아이디',
  })
  @IsNumber()
  airlineReviewId: number;

  @ApiProperty({
    example: '불쾌해요.',
    description: '리뷰 신고 사유',
  })
  @IsString()
  reportReason: string;
}
