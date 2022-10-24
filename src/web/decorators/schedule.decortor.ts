import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';
import { regularExp } from 'config/regular.exp';
import { response } from 'config/response.utils';

export const PostSchedule = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const postScheduleData = ctx.switchToHttp().getRequest().body;

    if (!postScheduleData.userId) {
      throw new HttpException(response.USERID_EMPTY, 201);
    }
    if (postScheduleData.userId <= 0) {
      throw new HttpException(response.INVALID_USERID, 201);
    }
    if (!postScheduleData.startAt) {
      throw new HttpException(response.START_AT_EMPTY, 201);
    }
    if (!regularExp.dateRegex.test(postScheduleData.startAt)) {
      throw new HttpException(response.INVALID_DATE_FORMAT, 201);
    }
    if (!postScheduleData.endAt) {
      throw new HttpException(response.END_AT_EMPTY, 201);
    }
    if (!regularExp.dateRegex.test(postScheduleData.endAt)) {
      throw new HttpException(response.INVALID_DATE_FORMAT, 201);
    }
    if (!postScheduleData.name) {
      throw new HttpException(response.SCHEDULE_NAME_EMPTY, 201);
    }
    if (postScheduleData.name.length > 10) {
      throw new HttpException(response.INVALID_SCHEDULE_NAME, 201);
    }
    if (!postScheduleData.departureAirportId) {
      throw new HttpException(response.DEPARTURE_AIRPORT_ID_EMPTY, 201);
    }
    if (postScheduleData.departureAirportId <= 0) {
      throw new HttpException(response.INVALID_AIRPORT_ID, 201);
    }
    if (!postScheduleData.arrivalAirportId) {
      throw new HttpException(response.ARRIVAL_AIRPORT_ID_EMPTY, 201);
    }
    if (postScheduleData.arrivalAirportId <= 0) {
      throw new HttpException(response.INVALID_AIRPORT_ID, 201);
    }
    if (!postScheduleData.airlineId) {
      throw new HttpException(response.AIRLINE_ID_EMPTY, 201);
    }
    if (postScheduleData.airlineId <= 0) {
      throw new HttpException(response.INVALID_AIRLINE_ID, 201);
    }
    if (!postScheduleData.departureAirportServiceIds) {
      throw new HttpException(response.DEPARTURE_AIRPORT_ID_EMPTY, 201);
    }
    if (!postScheduleData.arrivalAirportServiceIds) {
      throw new HttpException(response.ARRIVAL_AIRPORT_SERVICE_IDS_EMPTY, 201);
    }
    if (!postScheduleData.airlineServiceIds) {
      throw new HttpException(response.AIRLINE_SERVICE_IDS_EMPTY, 201);
    }

    return postScheduleData;
  },
);
