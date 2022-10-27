import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsObject } from 'class-validator';
import { BaseResponse } from 'config/base.response';

class PostAirportResultData {
  @ApiProperty({
    example: 1,
    description: '생성된 항공사 리뷰 아이디',
  })
  @IsNumber()
  createdReviewId: number;
}

export class PostAirportResponse extends BaseResponse {
  @ApiProperty({
    description: 'result 객체',
  })
  @IsObject()
  result: PostAirportResultData;
}
