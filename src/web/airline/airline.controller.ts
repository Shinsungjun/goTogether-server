import { Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BaseResponse } from 'config/base.response';
import { response } from 'config/response.utils';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import {
  DeleteAirlineReview,
  GetAirline,
  GetAirlineReviews,
  GetAirlineServices,
  PatchAirlineReview,
  PostAirlineReview,
} from '../decorators/airline.decorator';
import { AirlineService } from './airline.service';
import { DeleteAirlineReviewRequest } from './dto/delete-airline-review.request';
import { GetAirlineReviewsRequest } from './dto/get-airline-reviews.request';
import { GetAirlineReviewsResponse } from './dto/get-airline-reviews.response';
import { GetAirlineServicesRequest } from './dto/get-airline-services.request';
import { GetAirlineServicesResponse } from './dto/get-airline-services.response';
import { GetAirlineRequest } from './dto/get-airline.request';
import { GetAirlinesResponse } from './dto/get-airlines.response';
import { PatchAirlineReviewRequest } from './dto/patch-airline-review.request';
import { PostAirlineReviewReportRequest } from './dto/post-airline-review-report.request';
import { PostAirlineReviewRequest } from './dto/post-airline-review.request';
import { PostAirlineResponse } from './dto/post-airline-review.response';

@ApiTags('Airline API')
@Controller('/web/airlines')
export class AirlineController {
  constructor(private readonly airlineService: AirlineService) {}

  /*
    description: 항공사 리스트 조회 api
    requires: x
    returns: GetAirlinesResponse
  */
  @ApiOperation({ summary: '항공사 리스트 조회 API' })
  @ApiResponse({
    status: 1000,
    description: '성공',
    type: GetAirlinesResponse,
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
  @Get()
  async getAirlines(@Req() req: any) {
    return this.airlineService.retrieveAirlines();
  }

  /*
    description: 항공사 리뷰 신고 api
    requires: PostAirlineReviewReportRequest
    returns: PostAirlineReviewReportResponse
  */
  @ApiOperation({ summary: '항공사 리뷰 신고 API' })
  @ApiResponse({
    status: 1000,
    description: '성공',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 2000,
    description: 'jwt 검증 실패',
  })
  @ApiResponse({
    status: 2055,
    description: '리뷰 아이디를 입력해주세요.',
  })
  @ApiResponse({
    status: 2056,
    description: '리뷰 아이디는 0보다 큰 값을 입력해주세요.',
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
  @Post('/reviews/report')
  async postReviewReport(
    @Req() req: any,
    @PostAirlineReview()
    postAirlineReviewRequest: PostAirlineReviewReportRequest,
  ) {
    const userId = req.user.userId;
    return response.SUCCESS;
    // return this.airlineService.createReviewReport(
    //   userId,
    //   postAirlineReviewRequest,
    // );
  }

  /*
    description: 항공사 서비스 리스트 조회 api
    requires: GetAirlineServicesRequest
    returns: GetAirlineServicesResponse
  */
  @ApiOperation({ summary: '항공사 서비스 리스트 조회 API' })
  @ApiResponse({
    status: 1000,
    description: '성공',
    type: GetAirlineServicesResponse,
  })
  @ApiResponse({
    status: 2000,
    description: 'jwt 검증 실패',
  })
  @ApiResponse({
    status: 2028,
    description: '항공사 아이디를 입력해주세요.',
  })
  @ApiResponse({
    status: 2029,
    description: '항공사의 아이디는 0보다 큰 값을 입력해주세요.',
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
  @ApiParam({
    description: '항공사 아이디',
    name: 'airlineId',
    type: 'number',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/:airlineId/services')
  async getAirlineServices(
    @Req() req: any,
    @GetAirlineServices() getAirlineServicesRequest: GetAirlineServicesRequest,
  ) {
    return await this.airlineService.retrieveAirlineServices(
      getAirlineServicesRequest,
    );
  }

  /*
    description: 항공사 상세 조회 api
    requires: GetAirlineRequest
    returns: GetAirlineResponse
  */
  @ApiOperation({ summary: '항공사 상세 조회 API' })
  @ApiResponse({
    status: 2000,
    description: 'jwt 검증 실패',
  })
  @ApiResponse({
    status: 2028,
    description: '항공사 아이디를 입력해주세요.',
  })
  @ApiResponse({
    status: 2029,
    description: '항공사의 아이디는 0보다 큰 값을 입력해주세요.',
  })
  @ApiResponse({
    status: 2035,
    description: '존재하지 않는 항공사입니다.',
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
  @ApiParam({
    description: '항공사 아이디',
    name: 'airlineId',
    type: 'number',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/:airlineId')
  async getAirline(@GetAirline() getAirlineRequest: GetAirlineRequest) {
    return await this.airlineService.retrieveAirline(getAirlineRequest);
  }

  /*
    description: 항공사 리뷰 리스트 조회 api
    requires: GetAirlineReviewsRequest,
    returns: GetAirlineReviewsResponse,
  */
  @ApiOperation({ summary: '항공사 리뷰 리스트 조회 API' })
  @ApiResponse({
    status: 1000,
    description: '성공',
    type: GetAirlineReviewsResponse,
  })
  @ApiResponse({
    status: 2000,
    description: 'jwt 검증 실패',
  })
  @ApiResponse({
    status: 2028,
    description: '항공사 아이디를 입력해주세요.',
  })
  @ApiResponse({
    status: 2029,
    description: '항공사의 아이디는 0보다 큰 값을 입력해주세요.',
  })
  @ApiResponse({
    status: 2035,
    description: '존재하지 않는 항공사입니다.',
  })
  @ApiResponse({
    status: 2041,
    description: '페이지 번호를 입력해주세요.',
  })
  @ApiResponse({
    status: 2042,
    description: '유효하지 않은 페이지 값입니다.',
  })
  @ApiResponse({
    status: 2043,
    description: '존재하지 않는 페이지입니다.',
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
  @ApiParam({
    description: '항공사 아이디',
    name: 'airlineId',
    type: 'number',
  })
  @ApiQuery({
    description: '페이지 번호',
    name: 'page',
    type: 'number',
  })
  @ApiQuery({
    description: '항공사 서비스 아이디 (필터링 용)',
    name: 'airlineServiceId',
    type: 'number',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/:airlineId/reviews')
  async getAirlineReviews(
    @GetAirlineReviews() getAirlineReviewsRequest: GetAirlineReviewsRequest,
  ) {
    return await this.airlineService.retrieveAirlineReviews(
      getAirlineReviewsRequest,
    );
  }

  /*
    description: 항공사 리뷰 생성 api
    requires: PostAirlineReviewRequest,
    returns: PostAirlineReviewResponse,
  */
  @ApiOperation({ summary: '항공사 리뷰 생성 API' })
  @ApiResponse({
    status: 1000,
    description: '성공',
    type: PostAirlineResponse,
  })
  @ApiResponse({
    status: 2000,
    description: 'jwt 검증 실패',
  })
  @ApiResponse({
    status: 2014,
    description: '존재하지 않는 유저입니다.',
  })
  @ApiResponse({
    status: 2028,
    description: '항공사 아이디를 입력해주세요.',
  })
  @ApiResponse({
    status: 2029,
    description: '항공사의 아이디는 0보다 큰 값을 입력해주세요.',
  })
  @ApiResponse({
    status: 2033,
    description: '유저 아이디를 확인해주세요.',
  })
  @ApiResponse({
    status: 2037,
    description: '존재하지 않는 항공사 서비스입니다.',
  })
  @ApiResponse({
    status: 2035,
    description: '존재하지 않는 항공사입니다.',
  })
  @ApiResponse({
    status: 2047,
    description: '일정 아이디는 0보다 큰 값을 입력해주세요.',
  })
  @ApiResponse({
    status: 2048,
    description: '존재하지 않는 일정입니다.',
  })
  @ApiResponse({
    status: 2049,
    description: '유저의 일정이 아닙니다.',
  })
  @ApiResponse({
    status: 2050,
    description: '리뷰의 내용을 입력해주세요.',
  })
  @ApiResponse({
    status: 2051,
    description: '리뷰의 내용은 200자 이내로 입력해주세요.',
  })
  @ApiResponse({
    status: 2052,
    description: '별점을 입력해주세요.',
  })
  @ApiResponse({
    status: 2053,
    description: '별점은 0점과 5점 사이로 입력해주세요.',
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
  @ApiBody({
    description: '항공사 리뷰 생성 dto',
    type: PostAirlineReviewRequest,
  })
  @UseGuards(JwtAuthGuard)
  @Post('/reviews')
  async postAirlineReview(
    @Req() req: any,
    @PostAirlineReview() postAirlineReviewRequest: PostAirlineReviewRequest,
  ) {
    const userId = req.user.userId;
    if (userId != postAirlineReviewRequest.userId) {
      return response.USER_ERROR_TYPE;
    }

    return await this.airlineService.createAirlineReview(
      postAirlineReviewRequest,
    );
  }

  /*
    description: 항공사 리뷰 수정 api
    requires: PatchAirlineReviewRequest
    returns: BaseResponse
  */
  @ApiOperation({ summary: '항공사 리뷰 수정 API' })
  @ApiResponse({
    status: 1000,
    description: '성공',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 2000,
    description: 'jwt 검증 실패',
  })
  @ApiResponse({
    status: 2050,
    description: '리뷰의 내용을 입력해주세요.',
  })
  @ApiResponse({
    status: 2051,
    description: '리뷰의 내용은 200자 이내로 입력해주세요.',
  })
  @ApiResponse({
    status: 2055,
    description: '리뷰 아이디를 입력해주세요.',
  })
  @ApiResponse({
    status: 2056,
    description: '리뷰 아이디는 0보다 큰 값을 입력해주세요.',
  })
  @ApiResponse({
    status: 2059,
    description: '존재하지 않는 항공사 리뷰입니다.',
  })
  @ApiResponse({
    status: 2061,
    description: '작성 시간이 48시간이 넘었습니다.',
  })
  @ApiResponse({
    status: 2062,
    description: '유저가 작성한 리뷰가 아닙니다.',
  })
  @ApiResponse({
    status: 4000,
    description: '서버 에러',
  })
  @ApiBody({
    description: '항공사 리뷰 수정 DTO',
    type: PatchAirlineReviewRequest,
  })
  @ApiHeader({
    description: 'jwt token',
    name: 'x-access-token',
    example: 'JWT TOKEN',
    required: true,
  })
  @UseGuards(JwtAuthGuard)
  @Patch('/reviews')
  async patchAirlineReview(
    @Req() req: any,
    @PatchAirlineReview() patchAirlineReviewRequest: PatchAirlineReviewRequest,
  ) {
    const userId = req.user.userId;

    return await this.airlineService.editAirlineReview(
      userId,
      patchAirlineReviewRequest,
    );
  }

  /*
    description: 항공사 리뷰 삭제 api
    requires: PatchAirlineReviewRequest
    returns: BaseResponse
  */
  @ApiOperation({ summary: '항공사 리뷰 삭제 API' })
  @ApiResponse({
    status: 1000,
    description: '성공',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 2000,
    description: 'jwt 검증 실패',
  })
  @ApiResponse({
    status: 2055,
    description: '리뷰 아이디를 입력해주세요.',
  })
  @ApiResponse({
    status: 2056,
    description: '리뷰 아이디는 0보다 큰 값을 입력해주세요.',
  })
  @ApiResponse({
    status: 2059,
    description: '존재하지 않는 항공사 리뷰입니다.',
  })
  @ApiResponse({
    status: 2062,
    description: '유저가 작성한 리뷰가 아닙니다.',
  })
  @ApiResponse({
    status: 2063,
    description: '작성일이 30일이 지나지 않았습니다.',
  })
  @ApiResponse({
    status: 4000,
    description: '서버 에러',
  })
  @ApiBody({
    description: '항공사 리뷰 삭제 DTO',
    type: DeleteAirlineReviewRequest,
  })
  @ApiHeader({
    description: 'jwt token',
    name: 'x-access-token',
    example: 'JWT TOKEN',
    required: true,
  })
  @UseGuards(JwtAuthGuard)
  @Patch('/reviews/status')
  async patchAirlineReviewStatus(
    @Req() req: any,
    @DeleteAirlineReview()
    deleteAirlineReviewRequest: DeleteAirlineReviewRequest,
  ) {
    const userId = req.user.userId;

    return await this.airlineService.deleteAirlineReview(
      userId,
      deleteAirlineReviewRequest,
    );
  }
}
