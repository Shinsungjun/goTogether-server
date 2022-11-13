import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiHeader,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { GetAirportAirlineSearch } from '../decorators/search.decorator';
import { GetAirportAirlineSearchRequest } from './dto/get-airport-airline-search-request';
import { GetAirportAirlineSearchResponse } from './dto/get-airport-airline-search.response';
import { SearchService } from './search.service';

@ApiTags('Search API')
@Controller('/web/search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  /*
    description: 공항 항공사 검색 api
    requires: GetAirportAirlineSearchRequest
    returns: GetAirportAirlineSearchResponse
  */
  @ApiOperation({ summary: '공항 항공사 검색 API' })
  @ApiResponse({
    status: 1000,
    description: '성공',
    type: GetAirportAirlineSearchResponse,
  })
  @ApiResponse({
    status: 2000,
    description: 'jwt 검증 실패',
  })
  @ApiResponse({
    status: 2057,
    description: '검색어를 입력해주세요.',
  })
  @ApiResponse({
    status: 2058,
    description: '검색어는 0자보다 큰 값을 입력해주세요.',
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
  @ApiQuery({
    name: 'searchQuery',
    description: '검색어',
    type: GetAirportAirlineSearchRequest,
  })
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAirportAirlineSearch(
    @GetAirportAirlineSearch()
    getAirportAirlineSearchRequest: GetAirportAirlineSearchRequest,
  ) {
    return this.searchService.retrieveAirportAirlineSearch(
      getAirportAirlineSearchRequest,
    );
  }
}
