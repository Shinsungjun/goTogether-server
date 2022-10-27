import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsObject, IsString } from 'class-validator';
import { BaseResponse } from 'config/base.response';

class AirportServicesInfo {
  @ApiProperty({
    example: 1,
    description: '공항 서비스 아이디',
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    example: '한가족 서비스',
    description: '공항 서비스 이름',
  })
  @IsString()
  name: string;
}

class AirportDetailInfo {
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
    example: '1577-2600',
    description: '공항 고색센터 번호',
  })
  @IsString()
  customerServiceNumber: string;

  @ApiProperty({
    example: 'https://www.airport.kr/ap/ko/index.do',
    description: '공항 사이트 주소',
  })
  @IsString()
  website: string;

  @ApiProperty({
    example: '3.5',
    description: '리뷰 점수 평균',
  })
  @IsString()
  avgReview: string;

  @ApiProperty({
    example: '평일 9:00 ~ 18:00',
    description: '고객센터 운영시간',
  })
  @IsString()
  availableAt: string;

  @ApiProperty({
    example: [
      {
        id: 1,
        name: '임산부, 유아, 어린이',
      },
      {
        id: 2,
        name: '교통약자 동반',
      },
      {
        id: 3,
        name: '반려동물 동반',
      },
    ],
    description: '공항 서비스 리스트',
    type: AirportServicesInfo,
    isArray: true,
  })
  @IsArray()
  airportServices: Array<AirportServicesInfo>;
}

class GetAirportResultData {
  @ApiProperty({
    example: {
      airportId: 1,
      airportName: '인천국제공항',
      customerServiceNumber: '1577-2600',
      website: 'https://www.airport.kr/ap/ko/index.do',
      avgReview: '3.5',
      availableAt: '평일 9:00 ~ 18:00',
      airportServices: [
        {
          id: 1,
          name: '임산부, 유아, 어린이',
        },
        {
          id: 2,
          name: '교통약자 동반',
        },
        {
          id: 3,
          name: '반려동물 동반',
        },
      ],
    },
    description: '공항 정보 객체',
    type: AirportDetailInfo,
  })
  @IsObject()
  airport: AirportDetailInfo;
}

export abstract class GetAirportResponse extends BaseResponse {
  @ApiProperty({
    description: 'result 객체',
  })
  @IsObject()
  result: GetAirportResultData;
}
