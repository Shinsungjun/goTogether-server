import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsObject, IsString } from 'class-validator';
import { BaseResponse } from 'config/base.response';

class AirportServiceInfo {
  @ApiProperty({
    example: 1,
    description: '공항 서비스 아이디',
  })
  @IsNumber()
  airportServiceId: number;

  @ApiProperty({
    example: '교통약자 동반',
    description: '공항 서비스 이름',
  })
  @IsString()
  name: string;
}

class AirlineServiceInfo {
  @ApiProperty({
    example: 1,
    description: '항공사 서비스 아이디',
  })
  @IsNumber()
  airlineServiceId: number;

  @ApiProperty({
    example: '교통약자 동반',
    description: '항공사 서비스 이름',
  })
  @IsString()
  name: string;
}

class AirportReviewInfo {
  @ApiProperty({
    example: 1,
    description: '공항 아이디',
  })
  @IsNumber()
  airportId: number;

  @ApiProperty({
    example: '인천국제공항',
    description: '공항 이름',
  })
  @IsString()
  airportName: string;

  @ApiProperty({
    example: '인천',
    description: '공항 지역',
  })
  @IsString()
  region: string;

  @ApiProperty({
    example: [
      {
        airportServiceId: 2,
        name: '교통약자 동반',
      },
      {
        airportServiceId: 3,
        name: '반려동물 동반',
      },
    ],
    description: '공항 서비스 리스트',
    isArray: true,
    type: AirportServiceInfo,
  })
  @IsArray()
  airportServices: Array<AirportServiceInfo>;

  @ApiProperty({
    example: '작성완료',
    description: '리뷰 작성 여부',
  })
  @IsString()
  reviewStatus: string;
}

class AirlineReviewInfo {
  @ApiProperty({
    example: 1,
    description: '항공사 아이디',
  })
  @IsNumber()
  airlineId: number;

  @ApiProperty({
    example: '대한항공',
    description: '항공사 이름',
  })
  @IsString()
  airlineName: string;

  @ApiProperty({
    example:
      'https://blog.kakaocdn.net/dn/G1exv/btrNhgCiXez/3L04vyINyIhwH7RutKAHE1/img.png',
    description: '항공사 로고 이미지 url',
  })
  @IsString()
  logoImageUrl: string;

  @ApiProperty({
    example: [
      {
        airlineServiceId: 1,
        name: '한가족 서비스',
      },
      {
        airlineServiceId: 2,
        name: '유아 동반 승객',
      },
    ],
    description: '항공사 서비스 리스트',
    isArray: true,
    type: AirlineServiceInfo,
  })
  @IsArray()
  airportServices: Array<AirlineServiceInfo>;

  @ApiProperty({
    example: '작성완료',
    description: '리뷰 작성 여부',
  })
  @IsString()
  reviewStatus: string;
}

class GetScheduleReviewsResultData {
  @ApiProperty({
    example: {
      airportId: 1,
      airportName: '인천국제공항',
      region: '인천',
      airportServices: [
        {
          airportServiceId: 2,
          name: '교통약자 동반',
        },
        {
          airportServiceId: 3,
          name: '반려동물 동반',
        },
      ],
      reviewStatus: '작성완료',
    },
    description: '출발 공항 정보 및 리뷰 여부 객체',
    type: AirportReviewInfo,
    required: false,
  })
  @IsObject()
  departureAirport: AirportReviewInfo;

  @ApiProperty({
    example: {
      airportId: 2,
      airportName: '김포국제공항',
      region: '김포',
      airportServices: [
        {
          airportServiceId: 4,
          name: '임산부, 유아, 어린이',
        },
      ],
      reviewStatus: '작성전',
    },
    description: '도착 공항 정보 및 리뷰 여부 객체',
    type: AirportReviewInfo,
    required: false,
  })
  @IsObject()
  arrivalAirport: AirportReviewInfo;

  @ApiProperty({
    example: {
      airlineId: 1,
      airlineName: '대한항공',
      logoImageUrl:
        'https://blog.kakaocdn.net/dn/G1exv/btrNhgCiXez/3L04vyINyIhwH7RutKAHE1/img.png',
      airlineServices: [
        {
          airlineServiceId: 1,
          name: '한가족 서비스',
        },
        {
          airlineServiceId: 2,
          name: '유아 동반 승객',
        },
      ],
      reviewStatus: '작성전',
    },
    description: '항공사 정보 및 리뷰 여부 객체',
    type: AirlineReviewInfo,
    required: false,
  })
  @IsObject()
  airline: AirlineReviewInfo;
}

export abstract class GetScheduleReviewsResponse extends BaseResponse {
  @ApiProperty({
    description: 'result 객체',
  })
  @IsObject()
  result: GetScheduleReviewsResultData;
}
