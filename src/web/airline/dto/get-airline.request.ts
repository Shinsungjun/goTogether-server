import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class GetAirlineRequest {
  @ApiProperty({
    example: 1,
    description: '항공사 아이디',
  })
  @IsNumber()
  airlineId: number;
}
