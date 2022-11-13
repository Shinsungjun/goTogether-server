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

export const GetAirport = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const getAirportData = ctx.switchToHttp().getRequest().params;

    if (!getAirportData.airportId) {
      throw new HttpException(response.AIRPORT_ID_EMPTY, 200);
    }
    if (getAirportData.airportId <= 0) {
      throw new HttpException(response.INVALID_AIRPORT_ID, 200);
    }

    return getAirportData;
  },
);

export const GetAirportReviews = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const getAirportReviewsData = ctx.switchToHttp().getRequest();

    if (!getAirportReviewsData.params.airportId) {
      throw new HttpException(response.AIRPORT_ID_EMPTY, 200);
    }
    if (getAirportReviewsData.params.airportId <= 0) {
      throw new HttpException(response.INVALID_AIRPORT_ID, 200);
    }
    if (!getAirportReviewsData.query.page) {
      throw new HttpException(response.PAGE_EMPTY, 200);
    }
    if (getAirportReviewsData.query.page <= 0) {
      throw new HttpException(response.INVALID_PAGE, 200);
    }

    return {
      airportId: getAirportReviewsData.params.airportId,
      page: getAirportReviewsData.query.page,
      airportServiceId: getAirportReviewsData.query.airportServiceId,
    };
  },
);

export const PostAirportReview = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const postAirportReviewData = ctx.switchToHttp().getRequest().body;

    if (!postAirportReviewData.airportId) {
      throw new HttpException(response.AIRPORT_ID_EMPTY, 201);
    }
    if (postAirportReviewData.airportId <= 0) {
      throw new HttpException(response.INVALID_AIRPORT_ID, 201);
    }
    if (!postAirportReviewData.airportServiceIds) {
      throw new HttpException(response.AIRPORT_SERVICE_IDS_EMPTY, 201);
    }
    if (!postAirportReviewData.content) {
      throw new HttpException(response.REVIEW_CONTENT_EMPTY, 201);
    }
    if (postAirportReviewData.content.length > 200) {
      throw new HttpException(response.INVALID_REVIEW_CONTENT, 201);
    }
    if (!postAirportReviewData.score) {
      throw new HttpException(response.REVIEW_SCORE_EMPTY, 201);
    }
    if (postAirportReviewData.score > 5 || postAirportReviewData.score < 0) {
      throw new HttpException(response.INVALID_REVIEW_SCORE, 201);
    }
    if (
      postAirportReviewData.scheduleId &&
      postAirportReviewData.scheduleId <= 0
    ) {
      throw new HttpException(response.INVALID_SCHEDULE_ID, 201);
    }

    return postAirportReviewData;
  },
);

export const PatchAirportReview = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const patchAirportReviewData = ctx.switchToHttp().getRequest().body;

    if (!patchAirportReviewData.airportReviewId) {
      throw new HttpException(response.REVIEWID_EMPTY, 200);
    }
    if (patchAirportReviewData.airportReviewId <= 0) {
      throw new HttpException(response.INVALID_REVIEWID, 200);
    }
    if (!patchAirportReviewData.content) {
      throw new HttpException(response.REVIEW_CONTENT_EMPTY, 200);
    }
    if (patchAirportReviewData.content.length > 200) {
      throw new HttpException(response.INVALID_REVIEW_CONTENT, 200);
    }

    return patchAirportReviewData;
  },
);

export const DeleteAirportReview = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const deleteAirportReviewData = ctx.switchToHttp().getRequest().body;

    if (!deleteAirportReviewData.airportReviewId) {
      throw new HttpException(response.REVIEWID_EMPTY, 200);
    }
    if (deleteAirportReviewData.airportReviewId <= 0) {
      throw new HttpException(response.INVALID_REVIEWID, 200);
    }

    return deleteAirportReviewData;
  },
);

export const PostAirportReviewReport = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const postAirportReviewReportData = ctx.switchToHttp().getRequest().body;

    if (!postAirportReviewReportData.airportReviewId) {
      throw new HttpException(response.REVIEWID_EMPTY, 201);
    }
    if (postAirportReviewReportData.airportReviewId <= 0) {
      throw new HttpException(response.INVALID_REVIEWID, 201);
    }
    if (!postAirportReviewReportData.reviewReportReasonId) {
      throw new HttpException(response.REVIEW_REPORT_REASON_ID_EMPTY, 201);
    }
    if (postAirportReviewReportData.reviewReportReasonId <= 0) {
      throw new HttpException(response.INVALID_REVIEW_REPORT_REASON_ID, 201);
    }

    return postAirportReviewReportData;
  },
);
