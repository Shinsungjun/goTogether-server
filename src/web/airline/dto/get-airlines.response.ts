import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsObject, IsString } from 'class-validator';
import { BaseResponse } from 'config/base.response';

class AirlineInfo {
  @ApiProperty({
    example: 1,
    description: '항공사 아이디',
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    example: '대한항공',
    description: '항공사 이름',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example:
      'https://blog.kakaocdn.net/dn/G1exv/btrNhgCiXez/3L04vyINyIhwH7RutKAHE1/img.png',
    description: '항공사 로고 이미지 url',
  })
  @IsString()
  logoImageUrl: string;
}

class GetAirlinesResultData {
  @ApiProperty({
    example: [
      {
        id: 1,
        name: '대한항공',
        logoImageUrl:
          'https://blog.kakaocdn.net/dn/G1exv/btrNhgCiXez/3L04vyINyIhwH7RutKAHE1/img.png',
      },
      {
        id: 2,
        name: '아시아나항공',
        logoImageUrl:
          'https://mblogthumb-phinf.pstatic.net/20131030_122/jayjaewonhan_13831101361537N6oW_PNG/Asiana-Airlines-logo_%281%29.png?type=w2',
      },
    ],
    description: '항공사 리스트',
    isArray: true,
    type: AirlineInfo,
  })
  @IsArray()
  airlines: Array<AirlineInfo>;
}

export abstract class GetAirlinesResponse extends BaseResponse {
  @ApiProperty({
    description: 'result 객체',
  })
  @IsObject()
  result: GetAirlinesResultData;
}
