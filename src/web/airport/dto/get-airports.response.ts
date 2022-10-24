import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsObject, IsString } from 'class-validator';
import { BaseResponse } from 'config/base.response';

class AirportInfo {
  @ApiProperty({
    example: 1,
    description: '공항 아이디',
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    example: '인천국제공항',
    description: '공항 이름',
  })
  @IsString()
  name: string;
}

class GetAirportResultData {
  @ApiProperty({
    example: [
      {
        id: 1,
        name: '인천국제공항',
      },
      {
        id: 2,
        name: '김포국제공항',
      },
    ],
    description: '공항 리스트',
    isArray: true,
  })
  @IsArray()
  airports: Array<AirportInfo>;
}

export abstract class GetAirportResponse extends BaseResponse {
  @ApiProperty({
    description: 'result 객체',
  })
  @IsObject()
  result: GetAirportResultData;
}
