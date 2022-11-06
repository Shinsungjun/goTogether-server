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

export const PostAirlineReview = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const postAirlineReviewData = ctx.switchToHttp().getRequest().body;

    if (!postAirlineReviewData.airlineId) {
      throw new HttpException(response.AIRLINE_ID_EMPTY, 201);
    }
    if (postAirlineReviewData.airlineId <= 0) {
      throw new HttpException(response.INVALID_AIRLINE_ID, 201);
    }
    if (!postAirlineReviewData.airlineServiceIds) {
      throw new HttpException(response.AIRLINE_SERVICE_IDS_EMPTY, 201);
    }
    if (!postAirlineReviewData.content) {
      throw new HttpException(response.REVIEW_CONTENT_EMPTY, 201);
    }
    if (postAirlineReviewData.content.length > 200) {
      throw new HttpException(response.INVALID_REVIEW_CONTENT, 201);
    }
    if (!postAirlineReviewData.score) {
      throw new HttpException(response.REVIEW_SCORE_EMPTY, 201);
    }
    if (postAirlineReviewData.score > 5 || postAirlineReviewData.score < 0) {
      throw new HttpException(response.INVALID_REVIEW_SCORE, 201);
    }
    if (
      postAirlineReviewData.scheduleId &&
      postAirlineReviewData.scheduleId <= 0
    ) {
      throw new HttpException(response.INVALID_SCHEDULE_ID, 201);
    }

    return postAirlineReviewData;
  },
);

export const PostAirlineReviewReport = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const postAirlineReviewReportData = ctx.switchToHttp().getRequest().params;

    if (!postAirlineReviewReportData.reviewId) {
      throw new HttpException(response.REVIEWID_EMPTY, 201);
    }
    if (postAirlineReviewReportData.reviewId <= 0) {
      throw new HttpException(response.INVALID_REVIEWID, 201);
    }

    return postAirlineReviewReportData;
  },
);

export const PatchAirlineReview = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const patchAirlineReviewData = ctx.switchToHttp().getRequest().body;

    if (!patchAirlineReviewData.airlineReviewId) {
      throw new HttpException(response.REVIEWID_EMPTY, 200);
    }
    if (patchAirlineReviewData.airlineReviewId <= 0) {
      throw new HttpException(response.INVALID_REVIEWID, 200);
    }
    if (!patchAirlineReviewData.content) {
      throw new HttpException(response.REVIEW_CONTENT_EMPTY, 201);
    }
    if (patchAirlineReviewData.content.length > 200) {
      throw new HttpException(response.INVALID_REVIEW_CONTENT, 201);
    }

    return patchAirlineReviewData;
  },
);

export const DeleteAirlineReview = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const deleteAirlineReviewData = ctx.switchToHttp().getRequest().body;

    if (!deleteAirlineReviewData.airlineReviewId) {
      throw new HttpException(response.REVIEWID_EMPTY, 200);
    }
    if (deleteAirlineReviewData.airlineReviewId <= 0) {
      throw new HttpException(response.INVALID_REVIEWID, 200);
    }

    return deleteAirlineReviewData;
  },
);
