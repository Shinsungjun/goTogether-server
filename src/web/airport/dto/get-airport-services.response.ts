import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsObject, IsString } from 'class-validator';
import { BaseResponse } from 'config/base.response';

class AirportServicesInfo {
  @ApiProperty({
    example: 1,
    description: '공항 서비스 아이디',
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    example: '한가족 서비스',
    description: '공항 서비스 이름',
  })
  @IsString()
  name: string;
}

class GetAirportServicesResultData {
  @ApiProperty({
    example: [
      {
        id: 1,
        name: '한가족 서비스',
      },
      {
        id: 2,
        name: '유아 동반 승객',
      },
    ],
    description: '공항 서비스 리스트',
    isArray: true,
    type: AirportServicesInfo,
  })
  @IsArray()
  airportServices: Array<AirportServicesInfo>;
}

export abstract class GetAirportServicesResponse {
  @ApiProperty({
    description: 'result 객체',
  })
  @IsObject()
  result: GetAirportServicesResultData;
}
