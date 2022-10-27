import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import {
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import {
  GetAirport,
  GetAirportReviews,
  GetAirportServices,
} from '../decorators/airport.decorator';
import { AirportService } from './airport.service';
import { GetAirportReviewsRequest } from './dto/get-airport-reviews.request';
import { GetAirportReviewsResponse } from './dto/get-airport-reviews.response';
import { GetAirportServicesRequest } from './dto/get-airport-services.request';
import { GetAirportServicesResponse } from './dto/get-airport-services.response';
import { GetAirportRequest } from './dto/get-airport.request';
import { GetAirportResponse } from './dto/get-airport.response';
import { GetAirportsResponse } from './dto/get-airports.response';

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
  @ApiOperation({ summary: '공항 리뷰 리스트 조회 api' })
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
}
