import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class PostAirportReviewReportRequest {
  @ApiProperty({
    example: 1,
    description: '공항 리뷰 아이디',
  })
  @IsNumber()
  airportReviewId: number;

  @ApiProperty({
    example: 1,
    description: '리뷰 신고 사유 아이디',
  })
  @IsNumber()
  reviewReportReasonId: number;

  @ApiProperty({
    example: '리뷰 신고 사유입니다.',
    description: '직접입력의 신고 사유 (직접 입력일 경우에만)',
    required: false,
  })
  @IsString()
  etcReason: string;
}
