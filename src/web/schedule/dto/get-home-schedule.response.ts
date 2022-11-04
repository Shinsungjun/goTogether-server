import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsObject, IsString } from 'class-validator';
import { BaseResponse } from 'config/base.response';

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

class GetHomeScheduleResultData {
  @ApiProperty({
    example: {
      schedule: {
        scheduleId: 6,
        scheduleName: '제주도 여행',
        startAt: '2022.10.30',
        leftDay: 'D-1',
        departureAirportId: 3,
        departureAirportName: '양양국제공항',
        arrivalAirportId: 1,
        arrivalAirportName: '인천국제공항',
        airlineId: 2,
        airlineName: '아시아나항공',
        departureAirportService: ['임산부, 유아, 어린이', '교통약자 동반'],
        arrivalAirportService: ['임산부, 유아, 어린이', '교통약자 동반'],
        airlineService: ['한가족 서비스', '유아 동반 승객'],
      },
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
