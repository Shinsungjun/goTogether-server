import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';
import { GetSchedulesSort, GetSchedulesType } from 'common/variable.utils';
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

export const GetSchedules = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const getSchedulesData = ctx.switchToHttp().getRequest().query;

    if (!getSchedulesData.type) {
      throw new HttpException(response.GET_SCHEDULES_TYPE_EMPTY, 200);
    }
    if (!GetSchedulesType.includes(getSchedulesData.type)) {
      throw new HttpException(response.INVALID_GET_SCHEDULES_TYPE, 200);
    }
    if (getSchedulesData.type == 'past') {
      if (!getSchedulesData.page) {
        throw new HttpException(response.PAGE_EMPTY, 200);
      }
      if (getSchedulesData.page <= 0) {
        throw new HttpException(response.INVALID_PAGE, 200);
      }
      if (!getSchedulesData.sort) {
        throw new HttpException(response.SORT_EMPTY, 200);
      }
      if (!GetSchedulesSort.includes(getSchedulesData.sort)) {
        throw new HttpException(response.INVALID_GET_SCHEDULES_SORT, 200);
      }
      return getSchedulesData;
    }
  },
);

export const PatchScheduleStatus = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const patchScheduleStatusData = ctx.switchToHttp().getRequest().body;

    if (!patchScheduleStatusData.scheduleId) {
      throw new HttpException(response.SCHEDULE_ID_EMPTY, 200);
    }
    if (patchScheduleStatusData.scheduleId <= 0) {
      throw new HttpException(response.INVALID_SCHEDULE_ID, 200);
    }

    return patchScheduleStatusData;
  },
);

export const GetSchedule = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const getScheduleData = ctx.switchToHttp().getRequest().params;

    if (!getScheduleData.scheduleId) {
      throw new HttpException(response.SCHEDULE_ID_EMPTY, 200);
    }
    if (getScheduleData.scheduleId <= 0) {
      throw new HttpException(response.INVALID_SCHEDULE_ID, 200);
    }

    return getScheduleData;
  },
);
