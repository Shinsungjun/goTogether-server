import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class GetAirlineReviewsRequest {
  @ApiProperty({
    example: 1,
    description: '항공사 아이디',
  })
  @IsNumber()
  airlineId: number;

  @ApiProperty({
    example: 1,
    description: '페이지 번호',
  })
  @IsNumber()
  page: number;

  @ApiProperty({
    example: 1,
    description: '항공사 서비스 아이디 (필터링 용)',
    required: false,
  })
  @IsNumber()
  airlineServiceId: number & Array<number>;
}
