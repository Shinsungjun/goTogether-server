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
