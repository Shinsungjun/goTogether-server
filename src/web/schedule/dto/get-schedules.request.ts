import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class GetSchedulesRequest {
  @ApiProperty({
    example: 'past',
    description: '등록된 일정: future, 지난 일정: past',
  })
  @IsString()
  type: string;

  @ApiProperty({
    example: 1,
    description: '페이지 번호 (type이 past일 경우에만 보냄)',
    required: false,
  })
  @IsNumber()
  page: number;
}
