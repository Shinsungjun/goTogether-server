import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class PatchAirportReviewRequest {
  @ApiProperty({
    example: 1,
    description: '공항 리뷰 아이디',
  })
  @IsNumber()
  airportReviewId: number;

  @ApiProperty({
    example: '좋아요.',
    description: '리뷰 내용',
  })
  @IsString()
  content: string;
}
