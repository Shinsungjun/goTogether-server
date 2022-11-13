import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class DeleteAirportReviewRequest {
  @ApiProperty({
    example: 1,
    description: '공항 리뷰 아이디',
  })
  @IsNumber()
  airportReviewId: number;
}
