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
    example: '공항 장애인 이동 서비스',
    description: '항공사 서비스 이름',
  })
  @IsString()
  name: string;
}

class GetAirlineServicesResultData {
  @ApiProperty({
    example: [
      {
        id: 1,
        name: '공항 장애인 이동 서비스',
      },
      {
        id: 2,
        name: '휠체어 대여 서비스',
      },
    ],
    description: '항공사 서비스 리스트',
    isArray: true,
    type: AirlineServicesInfo,
  })
  @IsArray()
  airlineServices: Array<AirlineServicesInfo>;
}

export abstract class GetAirlineServicesResponse extends BaseResponse {
  @ApiProperty({
    description: 'result 객체',
  })
  @IsObject()
  result: GetAirlineServicesResultData;
}
