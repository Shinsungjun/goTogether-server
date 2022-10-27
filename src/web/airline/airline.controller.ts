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
  GetAirline,
  GetAirlineReviews,
  GetAirlineServices,
} from '../decorators/airline.decorator';
import { AirlineService } from './airline.service';
import { GetAirlineReviewsRequest } from './dto/get-airline-reviews.request';
import { GetAirlineReviewsResponse } from './dto/get-airline-reviews.response';
import { GetAirlineServicesRequest } from './dto/get-airline-services.request';
import { GetAirlineServicesResponse } from './dto/get-airline-services.response';
import { GetAirlineRequest } from './dto/get-airline.request';
import { GetAirlinesResponse } from './dto/get-airlines.response';

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
  @ApiOperation({ summary: '항공사 상세 조회 api' })
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
  @ApiOperation({ summary: '항공사 리뷰 리스트 조회 api' })
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
}
