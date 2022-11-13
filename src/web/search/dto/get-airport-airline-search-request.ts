import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetAirportAirlineSearchRequest {
  @ApiProperty({
    example: '인천공항',
    description: '검색어',
  })
  @IsString()
  searchQuery: string;
}
