import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { GetReviewReportReasonsResponse } from './dto/get-review-report-reasons.response';
import { GetUserDeleteReasonsResponse } from './dto/get-user-delete-reasons.response';
import { InfoService } from './info.service';

@ApiTags('Info API')
@Controller('/web/infos')
export class InfoController {
  constructor(private readonly infoService: InfoService) {}

  /*
    description: 회원 탈퇴 사유 리스트 조회 api
    requires: x
    returns: GetUserDeleteReasonsResponse
  */
  @ApiOperation({ summary: '회원 탈퇴 사유 리스트 조회 API' })
  @ApiResponse({
    status: 1000,
    description: '성공',
    type: GetUserDeleteReasonsResponse,
  })
  @ApiResponse({
    status: 2000,
    description: 'jwt 검증 실패',
  })
  @ApiResponse({
    status: 4000,
    description: '서버 에러',
  })
  @ApiHeader({
    description: 'jwt token',
    name: 'x-access-token',
    example: 'JWT TOKEN',
    required: true,
  })
  @UseGuards(JwtAuthGuard)
  @Get('/userdeletereasons')
  async getUserDeleteReasons() {
    return await this.infoService.retrieveUserDeleteReasons();
  }

  /*
    description: 리뷰 신고 사유 리스트 조회 api
    requires: x
    returns: GetReviewReportReasonsResponse
  */
  @ApiOperation({ summary: '리뷰 신고 사유 리스트 조회 API' })
  @ApiResponse({
    status: 1000,
    description: '성공',
    type: GetReviewReportReasonsResponse,
  })
  @ApiResponse({
    status: 2000,
    description: 'jwt 검증 실패',
  })
  @ApiResponse({
    status: 4000,
    description: '서버 에러',
  })
  @ApiHeader({
    description: 'jwt token',
    name: 'x-access-token',
    example: 'JWT TOKEN',
    required: true,
  })
  @UseGuards(JwtAuthGuard)
  @Get('/reviewreportreasons')
  async getReviewReportReasons() {
    return await this.infoService.retrieveReviewReportReasons();
  }
}
