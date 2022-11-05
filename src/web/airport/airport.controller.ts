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
  GetAirport,
  GetAirportReviews,
  GetAirportServices,
  PatchAirportReview,
  PostAirportReview,
} from '../decorators/airport.decorator';
import { AirportService } from './airport.service';
import { GetAirportReviewsRequest } from './dto/get-airport-review.request';
import { GetAirportReviewsResponse } from './dto/get-airport-review.response';
import { GetAirportServicesRequest } from './dto/get-airport-services.request';
import { GetAirportServicesResponse } from './dto/get-airport-services.response';
import { GetAirportRequest } from './dto/get-airport.request';
import { GetAirportResponse } from './dto/get-airport.response';
import { GetAirportsResponse } from './dto/get-airports.response';
import { PatchAirportReviewRequest } from './dto/patch-airport-review.request';
import { PostAirportReviewRequest } from './dto/post-airport-review.request';
import { PostAirportResponse } from './dto/post-airport-review.response';

@ApiTags('Airport API')
@Controller('/web/airports')
export class AirportController {
  constructor(private readonly airportService: AirportService) {}

  /*
    description: 공항 리스트 조회 api
    requires: x
    returns: GetAirportsResponse
  */
  @ApiOperation({ summary: '공항 리스트 조회 API' })
  @ApiResponse({
    status: 1000,
    description: '성공',
    type: GetAirportsResponse,
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
  async getAirports(@Req() req: any) {
    return await this.airportService.retrieveAirports();
  }

  /*
    description: 공항 서비스 리스트 조회 api
    requires: GetAirportServicesRequest
    returns: GetAirportServicesResponse
  */
  @ApiOperation({ summary: '공항 서비스 리스트 조회 API' })
  @ApiResponse({
    status: 1000,
    description: '성공',
    type: GetAirportServicesResponse,
  })
  @ApiResponse({
    status: 2000,
    description: 'jwt 검증 실패',
  })
  @ApiResponse({
    status: 2026,
    description: '공항 아이디는 0보다 큰 값을 입력해주세요.',
  })
  @ApiResponse({
    status: 2034,
    description: '존재하지 않는 공항입니다.',
  })
  @ApiResponse({
    status: 2038,
    description: '공항 아이디를 입력해주세요.',
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
    description: '공항 아이디',
    name: 'airportId',
    type: 'number',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/:airportId/services')
  async getAirportServices(
    @Req() req: any,
    @GetAirportServices() getAirportServicesRequest: GetAirportServicesRequest,
  ) {
    return await this.airportService.retrieveAirportServices(
      getAirportServicesRequest,
    );
  }

  /*
    description: 공항 상세 조회 api
    requires: GetAirportRequest
    returns: GetAirportResponse
  */
  @ApiOperation({ summary: '공항 상세 조회 API' })
  @ApiResponse({
    status: 1000,
    description: '성공',
    type: GetAirportResponse,
  })
  @ApiResponse({
    status: 2000,
    description: 'jwt 검증 실패',
  })
  @ApiResponse({
    status: 2026,
    description: '공항 아이디는 0보다 큰 값을 입력해주세요.',
  })
  @ApiResponse({
    status: 2034,
    description: '존재하지 않는 공항입니다.',
  })
  @ApiResponse({
    status: 2038,
    description: '공항 아이디를 입력해주세요.',
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
    description: '공항 아이디',
    name: 'airportId',
    type: 'number',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/:airportId')
  async getAirport(@GetAirport() getAirportRequest: GetAirportRequest) {
    return await this.airportService.retrieveAirport(getAirportRequest);
  }

  /*
    description: 공항 리뷰 리스트 조회 api
    requires: GetAirportReviewsRequest,
    returns: GetAirportReviewsResponse
  */
  @ApiOperation({ summary: '공항 리뷰 리스트 조회 API' })
  @ApiResponse({
    status: 1000,
    description: '성공',
    type: GetAirportReviewsResponse,
  })
  @ApiResponse({
    status: 2000,
    description: 'jwt 검증 실패',
  })
  @ApiResponse({
    status: 2026,
    description: '공항 아이디는 0보다 큰 값을 입력해주세요.',
  })
  @ApiResponse({
    status: 2034,
    description: '존재하지 않는 공항입니다.',
  })
  @ApiResponse({
    status: 2038,
    description: '공항 아이디를 입력해주세요.',
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
    description: '공항 아이디',
    name: 'airportId',
    type: 'number',
  })
  @ApiQuery({
    description: '페이지 번호',
    name: 'page',
    type: 'number',
  })
  @ApiQuery({
    description: '공항 서비스 아이디 (필터링 용)',
    name: 'airportServiceId',
    type: 'number',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/:airportId/reviews')
  async getAirportReviews(
    @GetAirportReviews() getAirportReviewsRequest: GetAirportReviewsRequest,
  ) {
    return await this.airportService.retrieveAirportReviews(
      getAirportReviewsRequest,
    );
  }

  /*
    description: 공항 리뷰 생성 api
    requires: PostAirportReviewRequest
    returns: PostAirportReviewResponse
  */
  @ApiOperation({ summary: '공항 리뷰 생성 API' })
  @ApiResponse({
    status: 1000,
    description: '성공',
    type: PostAirportResponse,
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
    status: 2026,
    description: '공항 아이디는 0보다 큰 값을 입력해주세요.',
  })
  @ApiResponse({
    status: 2033,
    description: '유저 아이디를 확인해주세요.',
  })
  @ApiResponse({
    status: 2034,
    description: '존재하지 않는 공항입니다.',
  })
  @ApiResponse({
    status: 2036,
    description: '존재하지 않는 공항 서비스입니다.',
  })
  @ApiResponse({
    status: 2038,
    description: '공항 아이디를 입력해주세요.',
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
    status: 2054,
    description: '공항의 서비스 아이디 리스트를 입력해주세요.',
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
    description: '공항 리뷰 생성 dto',
    type: PostAirportReviewRequest,
  })
  @UseGuards(JwtAuthGuard)
  @Post('/reviews')
  async postAirportReview(
    @Req() req: any,
    @PostAirportReview() postAirportReviewRequest: PostAirportReviewRequest,
  ) {
    const userId = req.user.userId;
    if (userId != postAirportReviewRequest.userId) {
      return response.USER_ERROR_TYPE;
    }

    return await this.airportService.createAirportReview(
      postAirportReviewRequest,
    );
  }

  /*
    description: 공항 리뷰 수정 api
    requires: PatchAirportReviewRequest
    returns: BaseResponse
  */
  @ApiOperation({ summary: '공항 리뷰 수정 API' })
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
    status: 2060,
    description: '존재하지 않는 공항 리뷰입니다.',
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
    description: '공항 리뷰 수정 DTO',
    type: PatchAirportReviewRequest,
  })
  @ApiHeader({
    description: 'jwt token',
    name: 'x-access-token',
    example: 'JWT TOKEN',
    required: true,
  })
  @UseGuards(JwtAuthGuard)
  @Patch('/reviews/:airportReviewId')
  async patchAirlineReview(
    @Req() req: any,
    @PatchAirportReview() patchAirportReviewRequest: PatchAirportReviewRequest,
  ) {
    const userId = req.user.userId;

    return await this.airportService.editAirportReview(
      userId,
      patchAirportReviewRequest,
    );
  }
}
