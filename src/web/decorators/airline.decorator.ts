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

    return postAirlineReviewData;
  },
);
