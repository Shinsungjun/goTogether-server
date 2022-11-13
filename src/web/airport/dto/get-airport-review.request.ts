import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class GetAirportReviewsRequest {
  @ApiProperty({
    example: 1,
    description: '공항 아이디',
  })
  @IsNumber()
  airportId: number;

  @ApiProperty({
    example: 1,
    description: '페이지 번호',
  })
  @IsNumber()
  page: number;

  @ApiProperty({
    example: 1,
    description: '공항 서비스 아이디 (필터링 용)',
    required: false,
  })
  @IsNumber()
  airportServiceId: number & Array<number>;
}
