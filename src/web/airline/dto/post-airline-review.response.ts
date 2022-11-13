import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsObject } from 'class-validator';
import { BaseResponse } from 'config/base.response';

class PostAirlineResultData {
  @ApiProperty({
    example: 1,
    description: '생성된 공항 리뷰 아이디',
  })
  @IsNumber()
  createdReviewId: number;
}

export class PostAirlineResponse extends BaseResponse {
  @ApiProperty({
    description: 'result 객체',
  })
  @IsObject()
  result: PostAirlineResultData;
}
