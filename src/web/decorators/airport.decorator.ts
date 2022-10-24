import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';
import { response } from 'config/response.utils';

export const GetAirportServices = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const getAirportServicesData = ctx.switchToHttp().getRequest().params;

    if (!getAirportServicesData.airportId) {
      throw new HttpException(response.AIRPORT_ID_EMPTY, 200);
    }
    if (getAirportServicesData.airportId <= 0) {
      throw new HttpException(response.INVALID_AIRPORT_ID, 200);
    }

    return getAirportServicesData;
  },
);
