import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsObject } from 'class-validator';
import { BaseResponse } from 'config/base.response';

class ReviewReportReason {
  @ApiProperty({
    example: 1,
    description: '리뷰 신고 사유 아이디',
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    example: '서비스와 전혀 상관없는 내용이에요',
    description: '리뷰 신고 사유',
  })
  name: string;
}

class GetReviewReportReasonsResultData {
  @ApiProperty({
    example: [
      {
        id: 1,
        name: '서비스와 전혀 상관없는 내용이에요',
      },
      {
        id: 2,
        name: '자꾸 광고하거나 홍보글을 올려요',
      },
      {
        id: 3,
        name: '사실이 아닌 거짓 정보에요',
      },
      {
        id: 4,
        name: '마음에 들지 않아요',
      },
      {
        id: 5,
        name: '이 계정이 다른 계정을 사칭하고 있어요',
      },
      {
        id: 6,
        name: '욕설, 혐오, 성적 발언이에요',
      },
      {
        id: 7,
        name: '직접입력',
      },
    ],
    description: '리뷰 신고 사유 객체 리스트',
    isArray: true,
    type: ReviewReportReason,
  })
  @IsArray()
  reviewReportReasons: Array<ReviewReportReason>;
}

export abstract class GetReviewReportReasonsResponse extends BaseResponse {
  @ApiProperty({
    description: 'result 객체',
  })
  @IsObject()
  result: GetReviewReportReasonsResultData;
}
