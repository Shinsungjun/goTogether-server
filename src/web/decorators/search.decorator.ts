import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';
import { response } from 'config/response.utils';

export const GetAirportAirlineSearch = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const getAirportAirlineSearchQuery = ctx.switchToHttp().getRequest().query;

    if (!getAirportAirlineSearchQuery.searchQuery) {
      throw new HttpException(response.SEARCH_QUERY_EMPTY, 200);
    }
    if (getAirportAirlineSearchQuery.searchQuery.length <= 0) {
      throw new HttpException(response.INVALID_SEARCH_QUERY, 200);
    }

    return getAirportAirlineSearchQuery;
  },
);
