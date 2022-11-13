import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsObject, IsString } from 'class-validator';
import { BaseResponse } from 'config/base.response';

class AirlineReviewInfo {
  @ApiProperty({
    example: 1,
    description: '항공사 리뷰 아이디',
  })
  @IsNumber()
  airlineReviewId: number;

  @ApiProperty({
    example: '핀',
    description: '작성자 닉네임',
  })
  @IsString()
  nickName: string;

  @ApiProperty({
    example: '3.0',
    description: '별점',
  })
  @IsString()
  score: string;

  @ApiProperty({
    example: '좋아요',
    description: '리뷰 내용',
  })
  @IsString()
  content: string;

  @ApiProperty({
    example: '22.10.27',
    description: '리뷰 작성 날짜',
  })
  @IsString()
  createdAt: string;

  @ApiProperty({
    example: ['한가족 서비스', '유아 동반 승객'],
    description: '리뷰한 항공사 서비스들',
  })
  @IsArray()
  reviewAirlineServices: Array<String>;
}

class GetAirlineReviewResultData {
  @ApiProperty({
    example: 1,
    description: '리뷰 총 개수',
    type: 'number',
  })
  @IsNumber()
  total: number;

  @ApiProperty({
    example: [
      {
        airlineReviewId: 3,
        nickName: '핀',
        score: '3.0',
        content: '좋아요',
        createdAt: '22.10.27',
        reviewedAirlineServices: ['한가족 서비스', '유아 동반 승객'],
      },
      {
        airlineReviewId: 1,
        nickName: '핀',
        score: '5.0',
        content: '좋아요',
        createdAt: '22.10.27',
        reviewedAirlineServices: ['한가족 서비스', '유아 동반 승객'],
      },
    ],
    description: '공항 리뷰 리스트',
    type: AirlineReviewInfo,
    isArray: true,
  })
  @IsArray()
  airlineReviews: Array<AirlineReviewInfo>;
}

export abstract class GetAirlineReviewsResponse extends BaseResponse {
  @ApiProperty({
    description: 'result 객체',
  })
  @IsObject()
  result: GetAirlineReviewResultData;
}
