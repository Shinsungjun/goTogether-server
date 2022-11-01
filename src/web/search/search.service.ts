import { Injectable } from '@nestjs/common';
import { makeResponse } from 'common/function.utils';
import { response } from 'config/response.utils';
import { DataSource } from 'typeorm';
import { GetAirportAirlineSearchRequest } from './dto/get-airport-airline-search-request';
import { SearchQuery } from './search.query';

@Injectable()
export class SearchService {
  constructor(
    private searchQuery: SearchQuery,
    private connection: DataSource,
  ) {}

  async retrieveAirportAirlineSearch(
    getAirportAirlineSearchRequest: GetAirportAirlineSearchRequest,
  ) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    try {
      let searchQuery;
      // 공백 대체
      searchQuery = getAirportAirlineSearchRequest.searchQuery.replace(
        / /g,
        '%',
      );

      let airportIndex = searchQuery.indexOf('공항');
      if (airportIndex == -1) {
        let airlineIndex = searchQuery.indexOf('항공');
        if (airlineIndex != -1) {
          if (airlineIndex > 0) {
            searchQuery =
              searchQuery.slice(0, airlineIndex) +
              '%' +
              searchQuery.slice(airlineIndex);
          } else {
            searchQuery =
              searchQuery.slice(airlineIndex, airlineIndex + 2) +
              '%' +
              searchQuery.slice(airlineIndex + 2);
          }
        }
      } else {
        if (airportIndex > 0) {
          searchQuery =
            searchQuery.slice(0, airportIndex) +
            '%' +
            searchQuery.slice(airportIndex);
        } else {
          searchQuery =
            searchQuery.slice(airportIndex, airportIndex + 2) +
            '%' +
            searchQuery.slice(airportIndex + 2);
        }
      }
      const airportSearchResult = await queryRunner.query(
        this.searchQuery.retrieveAirportSearch(searchQuery),
      );
      const airlineSearchResult = await queryRunner.query(
        this.searchQuery.retrieveAirlineSearch(searchQuery),
      );

      const searchResult = [...airportSearchResult, ...airlineSearchResult];

      const data = {
        searchResult: searchResult,
      };

      const result = makeResponse(response.SUCCESS, data);

      return result;
    } catch (error) {
      return response.ERROR;
    } finally {
      await queryRunner.release();
    }
  }
}
