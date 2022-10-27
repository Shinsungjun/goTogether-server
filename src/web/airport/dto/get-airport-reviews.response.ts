import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsObject, IsString } from 'class-validator';
import { BaseResponse } from 'config/base.response';

class AirportReviewInfo {
  @ApiProperty({
    example: 1,
    description: '공항 리뷰 아이디',
  })
  @IsNumber()
  airportReviewId: number;

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
    example: ['임산부, 유아, 어린이', '교통약자 동반', '반려동물 동반'],
    description: '리뷰한 공항 서비스들',
  })
  @IsArray()
  reviewdAirportServices: Array<String>;
}

class GetAirportReviewResultData {
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
        airportReviewId: 4,
        nickName: '핀',
        score: '3.0',
        content: '좋아요',
        createdAt: '22.10.27',
        reviewedAirportServices: ['반려동물 동반'],
      },
      {
        airportReviewId: 1,
        nickName: '핀',
        score: '4.0',
        content: '좋아요',
        createdAt: '22.10.26',
        reviewedAirportServices: [
          '임산부, 유아, 어린이',
          '교통약자 동반',
          '반려동물 동반',
        ],
      },
      {
        airportReviewId: 2,
        nickName: '핀',
        score: '3.0',
        content: '좋아요',
        createdAt: '22.10.26',
        reviewedAirportServices: ['임산부, 유아, 어린이'],
      },
    ],
    description: '공항 리뷰 리스트',
    type: AirportReviewInfo,
    isArray: true,
  })
  @IsArray()
  airportReviews: Array<AirportReviewInfo>;
}

export abstract class GetAirportReviewsResponse extends BaseResponse {
  @ApiProperty({
    description: 'result 객체',
  })
  @IsObject()
  result: GetAirportReviewResultData;
}
