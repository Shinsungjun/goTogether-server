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

  @ApiProperty({
    example: '인천',
    description: '지역 이름',
  })
  @IsString()
  region: string;
}

class GetAirportsResultData {
  @ApiProperty({
    example: [
      {
        id: 1,
        name: '인천국제공항',
        region: '인천',
      },
      {
        id: 2,
        name: '김포국제공항',
        region: '김포',
      },
    ],
    description: '공항 리스트',
    isArray: true,
    type: AirportInfo,
  })
  @IsArray()
  airports: Array<AirportInfo>;
}

export abstract class GetAirportsResponse extends BaseResponse {
  @ApiProperty({
    description: 'result 객체',
  })
  @IsObject()
  result: GetAirportsResultData;
}
