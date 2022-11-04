import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

export class PatchScheduleRequest {
  @ApiProperty({
    example: 1,
    description: '일정 아이디',
  })
  @IsNumber()
  scheduleId: number;

  @ApiProperty({
    example: '2022-10-24 18:00',
    description: '출발 날짜, 시간',
  })
  @IsString()
  startAt: string;

  @ApiProperty({
    example: 1,
    description: '출발 공항 아이디',
  })
  @IsNumber()
  departureAirportId: number;

  @ApiProperty({
    example: 1,
    description: '도착 공항 아이디',
  })
  @IsNumber()
  arrivalAirportId: number;

  @ApiProperty({
    example: 1,
    description: '항공사 아이디',
  })
  airlineId: number;

  @ApiProperty({
    example: [1, 2],
    description: '출발 공항 서비스 아이디 리스트 (선택안함 시 빈 배열)',
  })
  @IsArray()
  departureAirportServiceIds: Array<number>;

  @ApiProperty({
    example: [1, 2],
    description: '도착 공항 서비스 아이디 리스트 (선택안함 시 빈 배열)',
  })
  @IsArray()
  arrivalAirportServiceIds: Array<number>;

  @ApiProperty({
    example: [1, 2],
    description: '항공사 서비스 아이디 리스트 (선택안함 시 빈 배열)',
  })
  @IsArray()
  airlineServiceIds: Array<number>;
}
