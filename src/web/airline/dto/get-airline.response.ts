import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsObject, IsString } from 'class-validator';
import { BaseResponse } from 'config/base.response';

class AirlineServicesInfo {
  @ApiProperty({
    example: 1,
    description: '항공사 서비스 아이디',
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    example: '한가족 서비스',
    description: '항공사 서비스 이름',
  })
  @IsString()
  name: string;
}

class AirlineDetailInfo {
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
    example: '1577-2600',
    description: '항공사 고색센터 번호',
  })
  @IsString()
  customerServiceNumber: string;

  @ApiProperty({
    example: 'https://www.airport.kr/ap/ko/index.do',
    description: '항공사 사이트 주소',
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
        name: '한가족 서비스',
      },
      {
        id: 2,
        name: '유아 동반 승객',
      },
      {
        id: 3,
        name: '혼자 여행하는 어린이',
      },
      {
        id: 4,
        name: '몸이 불편한 승객',
      },
      {
        id: 5,
        name: '임신중인 승객',
      },
      {
        id: 6,
        name: '반려동물 동반 승객',
      },
    ],
    description: '항공사 서비스 리스트',
    type: AirlineServicesInfo,
    isArray: true,
  })
  @IsArray()
  airlineServices: Array<AirlineServicesInfo>;
}

class GetAirlineResultData {
  @ApiProperty({
    example: {
      airlineId: 1,
      airlineName: '대한항공',
      customerServiceNumber: '02-2656-2001',
      website: 'https://www.koreanair.com/kr/ko',
      avgReview: '4.0',
      availableAt: '매일 07:00 - 22:00',
      airlineServices: [
        {
          id: 1,
          name: '한가족 서비스',
        },
        {
          id: 2,
          name: '유아 동반 승객',
        },
        {
          id: 3,
          name: '혼자 여행하는 어린이',
        },
        {
          id: 4,
          name: '몸이 불편한 승객',
        },
        {
          id: 5,
          name: '임신중인 승객',
        },
        {
          id: 6,
          name: '반려동물 동반 승객',
        },
      ],
    },
    description: '항공사 정보 객체',
    type: AirlineDetailInfo,
  })
  @IsObject()
  airline: AirlineDetailInfo;
}

export abstract class GetAirlineResponse extends BaseResponse {
  @ApiProperty({
    description: 'result 객체',
  })
  @IsObject()
  result: GetAirlineResultData;
}
