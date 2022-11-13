import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsObject, IsString } from 'class-validator';
import { BaseResponse } from 'config/base.response';

class CreatedSchedule {
  @ApiProperty({
    example: 1,
    description: '생성된 일정 아이디',
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
    example: '22.10.13',
    description: '시작 날짜',
  })
  @IsString()
  startAt: string;

  @ApiProperty({
    example: '김포국제공항',
    description: '출발 공항 이름',
  })
  @IsString()
  departureAirportName: string;

  @ApiProperty({
    example: '여수공항',
    description: '도착 공항 이름',
  })
  @IsString()
  arrivalAirportName: string;

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

class PostScheduleResultData {
  @ApiProperty({
    example: {
      scheduleId: 18,
      scheduleName: '제주도 여행',
      startAt: '22.10.24',
      departureAirportName: '인천국제공항',
      arrivalAiportName: '김포국제공항',
      airlineName: '대한항공',
      departureAirportService: ['임산부, 유아, 어린이', '교통약자 동반'],
      arrivalAirportService: ['임산부, 유아, 어린이', '교통약자 동반'],
      airlineService: ['한가족 서비스', '유아 동반 승객'],
    },
    description: '생성된 일정 객체',
    type: CreatedSchedule,
  })
  @IsObject()
  createdSchedule: CreatedSchedule;
}

export abstract class PostScheduleResponse extends BaseResponse {
  @ApiProperty({
    description: 'result 객체',
  })
  @IsObject()
  result: PostScheduleResultData;
}
