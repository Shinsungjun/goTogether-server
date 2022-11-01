import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsObject, IsString } from 'class-validator';
import { BaseResponse } from 'config/base.response';

class Schedule {
  @ApiProperty({
    example: 1,
    description: '일정 아이디',
  })
  @IsNumber()
  scheduleId: number;

  @ApiProperty({
    example: '제주도 여행',
    description: '일정 이름',
  })
  @IsString()
  scheduleName: string;

  @ApiProperty({
    example: '2022.10.13',
    description: '시작 날짜',
  })
  @IsString()
  startAt: string;

  @ApiProperty({
    example: '2022.10.14',
    description: '종료 날짜',
  })
  @IsString()
  endAt: string;

  @ApiProperty({
    example: 'D-2',
    description: '디데이 (지난 일정이면 null)',
  })
  @IsString()
  leftDay: string;

  @ApiProperty({
    example: 1,
    description: '출발 공항 아이디',
  })
  @IsNumber()
  departureAirportId: number;

  @ApiProperty({
    example: '김포국제공항',
    description: '출발 공항 이름',
  })
  @IsString()
  departureAirportName: string;

  @ApiProperty({
    example: '김포',
    description: '출발 공항 지역',
  })
  @IsString()
  departureAirportRegion: string;

  @ApiProperty({
    example: '033-670-7398',
    description: '출발 공항 고객센터 전화번호',
  })
  @IsString()
  departureAirportCustomerServiceNumber: string;

  @ApiProperty({
    example: 'https://www.airport.co.kr/yangyang/index.do',
    description: '출발 공항 웹사이트',
  })
  @IsString()
  departureAirportWebsite: string;

  @ApiProperty({
    example: '4.0',
    description: '출발 공항 리뷰 평점',
  })
  @IsString()
  departureAirportAvgReview: string;

  @ApiProperty({
    example: 1,
    description: '도착 공항 아이디',
  })
  @IsNumber()
  arrivalAirportId: number;

  @ApiProperty({
    example: '여수공항',
    description: '도착 공항 이름',
  })
  @IsString()
  arrivalAirportName: string;

  @ApiProperty({
    example: '여수',
    description: '도착 공항 지역',
  })
  @IsString()
  arrivalAirportRegion: string;

  @ApiProperty({
    example: '033-670-7398',
    description: '도착 공항 고객센터 전화번호',
  })
  @IsString()
  arrivalAirportCustomerServiceNumber: string;

  @ApiProperty({
    example: 'https://www.airport.co.kr/yangyang/index.do',
    description: '도착 공항 웹사이트',
  })
  @IsString()
  arrivalAirportWebsite: string;

  @ApiProperty({
    example: '4.0',
    description: '도착 공항 리뷰 평점',
  })
  @IsString()
  arrivalAirportAvgReview: string;

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
    example: '033-670-7398',
    description: '항공사 고객센터 전화번호',
  })
  @IsString()
  airlineCustomerServiceNumber: string;

  @ApiProperty({
    example: 'https://www.airport.co.kr/yangyang/index.do',
    description: '항공사 웹사이트',
  })
  @IsString()
  airlineWebsite: string;

  @ApiProperty({
    example: '4.0',
    description: '항공사 리뷰 평점',
  })
  @IsString()
  airlineAvgReview: string;

  @ApiProperty({
    example: ['임산부, 유아, 어린이', '교통약자 동반'],
    description: '출발 공항 서비스',
  })
  @IsArray()
  departureAirportService: Array<String>;

  @ApiProperty({
    example: ['임산부, 유아, 어린이', '교통약자 동반'],
    description: '도착 공항 서비스',
  })
  @IsArray()
  arrivalAirportService: Array<String>;

  @ApiProperty({
    example: ['임산부, 유아, 어린이', '교통약자 동반'],
    description: '항공사 서비스',
  })
  @IsArray()
  airlineService: Array<String>;
}

class GetScheduleResultData {
  @ApiProperty({
    example: {
      schedule: {
        scheduleId: 6,
        scheduleName: '제주도 여행',
        startAt: '2022.10.30',
        endAt: '2022.11.24',
        leftDay: null,
        departureAirportId: 3,
        departureAirportName: '양양국제공항',
        departureAirportRegion: '양양',
        departureAirportCustomerServiceNumber: '033-670-7398',
        departureAirportWebsite: 'https://www.airport.co.kr/yangyang/index.do',
        departureAirportAvgReview: '0.0',
        arrivalAirportId: 1,
        arrivalAirportName: '인천국제공항',
        arrivalAirportRegion: '인천',
        arrivalAirportCustomerServiceNumber: '1577-2600',
        arrivalAirportWebsite: 'https://www.airport.kr/ap/ko/index.do',
        arrivalAirportAvgReview: '3.4',
        airlineId: 2,
        airlineName: '아시아나항공',
        logoImageUrl:
          'https://blog.kakaocdn.net/dn/G1exv/btrNhgCiXez/3L04vyINyIhwH7RutKAHE1/img.png',
        airlineCustomerServiceNumber: '02-2669-8000',
        airlineWebsite:
          'https://flyasiana.com/I/KR/KO/LowerPriceSearchList.do?menuId=CM201802220000728256&utm_source=google_pc&utm_medium=cpc&utm_campaign=brand_basic_creative&utm_content=&utm_term=&gclid=CjwKCAjw2OiaBhBSEiwAh2ZSP9kfDEwpfLolvaWOXB3COpR-kIrabK8y4SOYPEF7Fqc3sodGVW4fUhoCf0UQAvD_BwE',
        airlineAvgReview: '2.0',
        departureAirportService: ['임산부, 유아, 어린이', '교통약자 동반'],
        arrivalAirportService: ['임산부, 유아, 어린이', '교통약자 동반'],
        airlineService: ['한가족 서비스', '유아 동반 승객'],
      },
    },
    description: '일정 객체',
    type: Schedule,
  })
  @IsObject()
  schedule: Schedule;
}

export abstract class GetScheduleResponse extends BaseResponse {
  @ApiProperty({
    description: 'result 객체',
  })
  @IsObject()
  result: GetScheduleResultData;
}
