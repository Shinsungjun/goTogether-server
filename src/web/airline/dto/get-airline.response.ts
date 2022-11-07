import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsObject, IsString } from 'class-validator';
import { BaseResponse } from 'config/base.response';

class AirlineServiceInfo {
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

  @ApiProperty({
    example: 'https://flyasiana.com/C/KR/KO/contents/disabled-passenger',
    description: '항공사 서비스 웹사이트',
  })
  @IsString()
  website: string;
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
        id: 7,
        name: '장애인 고객',
        website: 'https://flyasiana.com/C/KR/KO/contents/disabled-passenger',
      },
      {
        id: 8,
        name: '고령자 고객',
        website: 'https://flyasiana.com/C/KR/KO/contents/elderly-passenger',
      },
      {
        id: 9,
        name: '임신부 고객',
        website: 'https://flyasiana.com/C/KR/KO/contents/pregnant-passenger',
      },
      {
        id: 10,
        name: '유/소아 동반 고객',
        website: 'https://flyasiana.com/C/KR/KO/contents/traveling-with-minors',
      },
      {
        id: 11,
        name: '혼자 여행하는 어린이/청소년',
        website: 'https://flyasiana.com/C/KR/KO/contents/unaccompanied-minor',
      },
      {
        id: 12,
        name: '반려동물 동반',
        website: 'https://flyasiana.com/C/KR/KO/contents/traveling-with-pets',
      },
      {
        id: 13,
        name: '의료도움이 필요한 고객',
        website:
          'https://flyasiana.com/C/KR/KO/contents/medical-assistance-guide',
      },
    ],
    description: '항공사 서비스 리스트',
    type: AirlineServiceInfo,
    isArray: true,
  })
  @IsArray()
  airlineServices: Array<AirlineServiceInfo>;
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
          id: 7,
          name: '장애인 고객',
          website: 'https://flyasiana.com/C/KR/KO/contents/disabled-passenger',
        },
        {
          id: 8,
          name: '고령자 고객',
          website: 'https://flyasiana.com/C/KR/KO/contents/elderly-passenger',
        },
        {
          id: 9,
          name: '임신부 고객',
          website: 'https://flyasiana.com/C/KR/KO/contents/pregnant-passenger',
        },
        {
          id: 10,
          name: '유/소아 동반 고객',
          website:
            'https://flyasiana.com/C/KR/KO/contents/traveling-with-minors',
        },
        {
          id: 11,
          name: '혼자 여행하는 어린이/청소년',
          website: 'https://flyasiana.com/C/KR/KO/contents/unaccompanied-minor',
        },
        {
          id: 12,
          name: '반려동물 동반',
          website: 'https://flyasiana.com/C/KR/KO/contents/traveling-with-pets',
        },
        {
          id: 13,
          name: '의료도움이 필요한 고객',
          website:
            'https://flyasiana.com/C/KR/KO/contents/medical-assistance-guide',
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
