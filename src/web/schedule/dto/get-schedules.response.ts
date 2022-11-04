import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsObject, IsString } from 'class-validator';
import { BaseResponse } from 'config/base.response';

class ScheduleInfo {
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
    description: '디데이 (등록된 일정에서만 나옴)',
    required: false,
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
}

class GetSchedulesResultData {
  @ApiProperty({
    example: 1,
    description: '전체 지난 일정 개수',
    required: false,
  })
  @IsNumber()
  scheduleCount: number;

  @ApiProperty({
    example: [
      {
        scheduleId: 1,
        scheduleName: '제주도 여행',
        startAt: '2022.02.03',
        leftDay: 'D-2',
        departureAirportId: 1,
        departureAirportName: '인천국제공항',
        arrivalAirportId: 1,
        arrivalAirportName: '여수공항',
        airlineId: 1,
        airlineName: '대한항공',
      },
      {
        scheduleId: 2,
        scheduleName: '여수 여행',
        startAt: '2022.03.04',
        leftDay: 'D-3',
        departureAirportId: 1,
        departureAirportName: '인천국제공항',
        arrivalAirportId: 1,
        arrivalAirportName: '여수공항',
        airlineId: 1,
        airlineName: '대한항공',
      },
    ],
    description: '일정 리스트',
    isArray: true,
    type: ScheduleInfo,
  })
  @IsArray()
  schedules: Array<ScheduleInfo>;
}

export abstract class GetSchedulesResponse extends BaseResponse {
  @ApiProperty({
    description: 'result 객체',
  })
  @IsObject()
  result: GetSchedulesResultData;
}
