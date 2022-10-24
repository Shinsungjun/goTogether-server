import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { AirportService } from './airport.service';
import { GetAirportsResponse } from './dto/get-airports.response';

@ApiTags('Airport API')
@Controller('/web/airports')
export class AirportController {
  constructor(private readonly airportService: AirportService) {}

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
}
