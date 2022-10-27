import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDecimal, IsNumber, IsString } from 'class-validator';

export class PostAirlineReviewRequest {
  @ApiProperty({
    example: 1,
    description: '유저 아이디',
  })
  @IsNumber()
  userId: number;

  @ApiProperty({
    example: 1,
    description: '항공사 아이디',
  })
  @IsNumber()
  airlineId: number;

  @ApiProperty({
    example: [1, 2],
    description: '항공사 서비스 아이디 (선택안함 시 빈 리스트)',
  })
  @IsArray()
  airlineServiceIds: Array<number>;

  @ApiProperty({
    example: '좋아요',
    description: '리뷰 내용',
  })
  @IsString()
  content: string;

  @ApiProperty({
    example: 3.5,
    description: '리뷰 별점',
  })
  @IsDecimal()
  score: number;
}
