import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import {
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { GetAirlineServices } from '../decorators/airline.decorator';
import { AirlineService } from './airline.service';
import { GetAirlineServicesRequest } from './dto/get-airline-services.request';
import { GetAirlineServicesResponse } from './dto/get-airline-services.response';
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
}
