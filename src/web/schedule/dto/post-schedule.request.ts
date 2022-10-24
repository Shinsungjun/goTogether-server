import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString, IsNumber, IsString } from 'class-validator';

export class PostScheduleRequest {
  @ApiProperty({
    example: 1,
    description: '유저 아이디',
  })
  @IsNumber()
  userId: number;

  @ApiProperty({
    example: '2022-10-24',
    description: '출발 날짜',
  })
  @IsDateString()
  startAt: string;

  @ApiProperty({
    example: '2022-10-24',
    description: '도착 날짜',
  })
  @IsDateString()
  endAt: string;

  @ApiProperty({
    example: '제주도 여행',
    description: '여행 이름',
  })
  @IsString()
  name: string;

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
