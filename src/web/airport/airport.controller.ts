import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import {
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { GetAirportServices } from '../decorators/airport.decorator';
import { AirportService } from './airport.service';
import { GetAirportServicesRequest } from './dto/get-airport-services.request';
import { GetAirportServicesResponse } from './dto/get-airport-services.response';
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
}
