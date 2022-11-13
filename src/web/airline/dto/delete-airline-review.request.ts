import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class DeleteAirlineReviewRequest {
  @ApiProperty({
    example: 1,
    description: '항공사 리뷰 아이디',
  })
  @IsNumber()
  airlineReviewId: number;
}
