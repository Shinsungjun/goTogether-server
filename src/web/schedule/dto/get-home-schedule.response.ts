import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsObject, IsString } from 'class-validator';
import { BaseResponse } from 'config/base.response';

class AirportService {
  @ApiProperty({
    example: 1,
    description: '공항 서비스 아이디',
  })
  @IsNumber()
  airportServiceId: number;

  @ApiProperty({
    example: '반려동물 동반',
    description: '공항 서비스 이름',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'https://www.airport.co.kr/gimhae/cms/frCon/index.do?MENU_ID=290',
    description: '공항 서비스 웹 사이트',
  })
  @IsString()
  website: string;
}

class AirlineService {
  @ApiProperty({
    example: 1,
    description: '항공사 서비스 아이디',
  })
  @IsNumber()
  airlineServiceId: number;

  @ApiProperty({
    example: '유아 동반 승객',
    description: '항공사 서비스 이름',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example:
      'https://www.koreanair.com/kr/ko/airport/assistance/travel-with-child',
    description: '항공사 서비스 웹 사이트',
  })
  @IsString()
  website: string;
}

class HomeSchedule {
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
    example: [
      {
        airportServiceId: 1,
        name: '임산부, 유아, 어린이 동반',
        website:
          'https://www.airport.co.kr/gimpo/cms/frCon/index.do?MENU_ID=1440',
      },
      {
        airportServiceId: 2,
        name: '장애인, 고령자 동반',
        website:
          'https://www.airport.co.kr/gimpo/cms/frCon/index.do?MENU_ID=1450',
      },
      {
        airportServiceId: 3,
        name: '반려동물 동반',
        website:
          'https://www.airport.co.kr/gimpo/cms/frCon/index.do?MENU_ID=1460',
      },
    ],
    description: '출발 공항 서비스 객체 리스트',
    type: AirportService,
  })
  @IsArray()
  departureAirportService: Array<AirportService>;

  @ApiProperty({
    example: [
      {
        airportServiceId: 1,
        name: '임산부, 유아, 어린이 동반',
        website:
          'https://www.airport.co.kr/gimpo/cms/frCon/index.do?MENU_ID=1440',
      },
      {
        airportServiceId: 2,
        name: '장애인, 고령자 동반',
        website:
          'https://www.airport.co.kr/gimpo/cms/frCon/index.do?MENU_ID=1450',
      },
      {
        airportServiceId: 3,
        name: '반려동물 동반',
        website:
          'https://www.airport.co.kr/gimpo/cms/frCon/index.do?MENU_ID=1460',
      },
    ],
    description: '도착 공항 서비스',
    type: AirportService,
  })
  @IsArray()
  arrivalAirportService: Array<AirportService>;

  @ApiProperty({
    example: [
      {
        airlineServiceId: 2,
        name: '유아 동반 승객',
        website:
          'https://www.koreanair.com/kr/ko/airport/assistance/travel-with-child',
      },
      {
        airlineServiceId: 1,
        name: '한가족 서비스',
        website:
          'https://www.koreanair.com/kr/ko/airport/assistance/family-service',
      },
    ],
    description: '항공사 서비스',
    type: AirlineService,
  })
  @IsArray()
  airlineService: Array<AirlineService>;
}

class GetHomeScheduleResultData {
  @ApiProperty({
    example: {
      scheduleId: 4,
      scheduleName: '제주도 여행',
      startAt: '2022.11.10',
      leftDay: 'D-1',
      departureAirportId: 1,
      departureAirportName: '김포공항',
      arrivalAirportId: 2,
      arrivalAirportName: '김해공항',
      airlineId: 1,
      airlineName: '아시아나항공',
      departureAirportService: [
        {
          airportServiceId: 1,
          name: '임산부, 유아, 어린이 동반',
          website:
            'https://www.airport.co.kr/gimpo/cms/frCon/index.do?MENU_ID=1440',
        },
        {
          airportServiceId: 2,
          name: '장애인, 고령자 동반',
          website:
            'https://www.airport.co.kr/gimpo/cms/frCon/index.do?MENU_ID=1450',
        },
        {
          airportServiceId: 3,
          name: '반려동물 동반',
          website:
            'https://www.airport.co.kr/gimpo/cms/frCon/index.do?MENU_ID=1460',
        },
      ],
      arrivalAirportService: [
        {
          airportServiceId: 4,
          name: '임산부, 유아, 어린이 동반',
          website:
            'https://www.airport.co.kr/gimhae/cms/frCon/index.do?MENU_ID=270',
        },
        {
          airportServiceId: 6,
          name: '반려동물 동반',
          website:
            'https://www.airport.co.kr/gimhae/cms/frCon/index.do?MENU_ID=290',
        },
      ],
      airlineService: [
        {
          airlineServiceId: 2,
          name: '유아 동반 승객',
          website:
            'https://www.koreanair.com/kr/ko/airport/assistance/travel-with-child',
        },
        {
          airlineServiceId: 1,
          name: '한가족 서비스',
          website:
            'https://www.koreanair.com/kr/ko/airport/assistance/family-service',
        },
      ],
    },
    description: '일정 객체',
    type: HomeSchedule,
  })
  @IsObject()
  schedule: HomeSchedule;
}

export abstract class GetHomeScheduleResponse extends BaseResponse {
  @ApiProperty({
    description: 'result 객체',
  })
  @IsObject()
  result: GetHomeScheduleResultData;
}
