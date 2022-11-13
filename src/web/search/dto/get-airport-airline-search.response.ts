import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsObject, IsString } from 'class-validator';
import { BaseResponse } from 'config/base.response';

class SearchResult {
  @ApiProperty({
    example: 1,
    description: '공항(항공사) 아이디',
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    example: '인천국제공항',
    description: '공항(항공사) 이름',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: '3.4',
    description: '공항(항공사) 리뷰 평점',
  })
  @IsString()
  avgReview: string;

  @ApiProperty({
    example: '1577-2600',
    description: '공항(항공사) 고객센터 전화번호',
  })
  @IsString()
  customerServiceNumber: string;

  @ApiProperty({
    example: 'https://www.airport.kr/ap/ko/index.do',
    description: '공항(항공사) 웹사이트',
  })
  @IsString()
  website: string;

  @ApiProperty({
    example:
      'https://blog.kakaocdn.net/dn/G1exv/btrNhgCiXez/3L04vyINyIhwH7RutKAHE1/img.png',
    description: '항공사 로고 이미지 (항공사 결과에서만 존재)',
    required: false,
  })
  @IsString()
  logoImageUrl: string;
}

class GetAirportAirlineSearchResultData {
  @ApiProperty({
    example: [
      {
        id: 2,
        name: '아시아나항공',
        avgReview: '2.0',
        logoImageUrl:
          'https://mblogthumb-phinf.pstatic.net/20131030_122/jayjaewonhan_13831101361537N6oW_PNG/Asiana-Airlines-logo_%281%29.png?type=w2',
        customerServiceNumber: '02-2669-8000',
        website:
          'https://flyasiana.com/I/KR/KO/LowerPriceSearchList.do?menuId=CM201802220000728256&utm_source=google_pc&utm_medium=cpc&utm_campaign=brand_basic_creative&utm_content=&utm_term=&gclid=CjwKCAjw2OiaBhBSEiwAh2ZSP9kfDEwpfLolvaWOXB3COpR-kIrabK8y4SOYPEF7Fqc3sodGVW4fUhoCf0UQAvD_BwE',
      },
    ],
    description: '검색 결과 리스트',
    type: SearchResult,
    isArray: true,
  })
  @IsArray()
  searchResult: SearchResult;
}

export abstract class GetAirportAirlineSearchResponse extends BaseResponse {
  @ApiProperty({
    description: 'result 객체',
  })
  @IsObject()
  result: GetAirportAirlineSearchResultData;
}
