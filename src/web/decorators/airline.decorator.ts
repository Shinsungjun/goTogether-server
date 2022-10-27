import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';
import { response } from 'config/response.utils';

export const GetAirlineServices = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const getAirlineServicesData = ctx.switchToHttp().getRequest().params;

    if (!getAirlineServicesData.airlineId) {
      throw new HttpException(response.AIRLINE_ID_EMPTY, 200);
    }
    if (getAirlineServicesData.airlineId <= 0) {
      throw new HttpException(response.INVALID_AIRLINE_ID, 200);
    }

    return getAirlineServicesData;
  },
);

export const GetAirline = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const getAirlineData = ctx.switchToHttp().getRequest().params;

    if (!getAirlineData.airlineId) {
      throw new HttpException(response.AIRLINE_ID_EMPTY, 200);
    }
    if (getAirlineData.airlineId <= 0) {
      throw new HttpException(response.INVALID_AIRLINE_ID, 200);
    }

    return getAirlineData;
  },
);

export const GetAirlineReviews = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const getAirlineReviewsData = ctx.switchToHttp().getRequest();

    if (!getAirlineReviewsData.params.airlineId) {
      throw new HttpException(response.AIRLINE_ID_EMPTY, 200);
    }
    if (getAirlineReviewsData.params.airlineId <= 0) {
      throw new HttpException(response.INVALID_AIRLINE_ID, 200);
    }
    if (!getAirlineReviewsData.query.page) {
      throw new HttpException(response.PAGE_EMPTY, 200);
    }
    if (getAirlineReviewsData.query.page <= 0) {
      throw new HttpException(response.INVALID_PAGE, 200);
    }

    return {
      airlineId: getAirlineReviewsData.params.airlineId,
      page: getAirlineReviewsData.query.page,
      airlineServiceId: getAirlineReviewsData.query.airlineServiceId,
    };
  },
);
