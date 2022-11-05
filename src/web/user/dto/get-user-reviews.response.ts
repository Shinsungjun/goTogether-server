import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsObject, IsString } from 'class-validator';
import { BaseResponse } from 'config/base.response';

class UserReview {
  @ApiProperty({
    example: 1,
    description: '리뷰 아이디',
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    example: '인천국제공항',
    description: '공항, 항공사 이름',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: '인천',
    description: '지역 이름(공항 리뷰인 경우)',
    required: false,
  })
  @IsString()
  region: string;

  @ApiProperty({
    example:
      'https://blog.kakaocdn.net/dn/G1exv/btrNhgCiXez/3L04vyINyIhwH7RutKAHE1/img.png',
    description: '항공사 로고 사진 url(항공사 리뷰인 경우)',
    required: false,
  })
  @IsString()
  logoImageUrl: string;

  @ApiProperty({
    example: '3.5',
    description: '리뷰 점수',
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
    description: '작성 날짜',
  })
  @IsString()
  createdAt: string;

  @ApiProperty({
    example: ['한가족 서비스', '유아 동반 승객'],
    description: '리뷰한 항공사 서비스 리스트',
    isArray: true,
  })
  @IsArray()
  reviewedAirlineServices: Array<string>;

  @ApiProperty({
    example: ['임산부, 유아, 어린이', '교통약자 동반', '반려동물 동반'],
    description: '리뷰한 공항 서비스 리스트',
    isArray: true,
  })
  @IsArray()
  reviewedAirportServices: Array<string>;
}

class GetUserReviewsResultData {
  @ApiProperty({
    example: [
      {
        id: 6,
        name: '인천국제공항',
        region: '인천',
        score: '3.5',
        content: '좋아요',
        createdAt: '22.10.27',
        reviewedAirportServices: ['임산부, 유아, 어린이', '교통약자 동반'],
        type: 'AIRPORT',
      },
      {
        id: 5,
        name: '대한항공',
        logoImageUrl:
          'https://blog.kakaocdn.net/dn/G1exv/btrNhgCiXez/3L04vyINyIhwH7RutKAHE1/img.png',
        score: '3.5',
        content: '좋아요',
        createdAt: '22.10.27',
        reviewedAirlineServices: ['한가족 서비스', '유아 동반 승객'],
        type: 'AIRLINE',
      },
    ],
    description: '유저 리뷰 리스트',
    isArray: true,
    type: UserReview,
  })
  @IsArray()
  userReviews: Array<UserReview>;
}

export abstract class GetUserReviewsResponse extends BaseResponse {
  @ApiProperty({
    description: 'result 객체',
  })
  @IsObject()
  result: GetUserReviewsResultData;
}
