import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class PatchAirlineReviewRequest {
  @ApiProperty({
    example: 1,
    description: '항공사 리뷰 아이디',
  })
  @IsNumber()
  airlineReviewId: number;

  @ApiProperty({
    example: '좋아요.',
    description: '리뷰 내용',
  })
  @IsString()
  content: string;
}
