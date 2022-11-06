import { Injectable } from '@nestjs/common';

@Injectable()
export class AirlineQuery {
  retrieveAirlineQuery = (airlineId: number): string => {
    return `
      SELECT Airline.id   as airlineId,
            Airline.name as airlineName,
            Airline.customerServiceNumber,
            Airline.website,
            IF(avgReview.avgReview is null, 0, avgReview.avgReview) as avgReview,
            Airline.availableAt
      FROM Airline
              left join (select round(avg(score), 1) as avgReview, airlineId
                    from AirlineReview
                    where status = 'ACTIVE'
                    group by airlineId) avgReview
                    on avgReview.airlineId = Airline.id
      WHERE Airline.id = ${airlineId}
      group by Airline.id;
    `;
  };

  retrieveTotalAirlineReviewsQuery = (
    airlineId: number,
    filterQuery: string,
  ): string => {
    return `
      SELECT AirlineReview.id                                 as airlineReviewId,
            User.nickName,
            AirlineReview.score,
            AirlineReview.content,
            DATE_FORMAT(AirlineReview.createdAt, '%y.%m.%d') as createdAt
      FROM ReviewAirlineService
              join AirlineReview on AirlineReview.id = ReviewAirlineService.airlineReviewId
              join User on User.id = AirlineReview.userId
              join AirportService on AirportService.id = ReviewAirlineService.airlineServiceId
      WHERE AirlineReview.airlineId = ${airlineId}
        and AirlineReview.status = 'ACTIVE' ${filterQuery}
      group by AirlineReview.id
      order by AirlineReview.createdAt desc;
    `;
  };

  retrieveAirlineReviewsQuery = (
    airlineId: number,
    offset: number,
    pageSize: number,
    filterQuery: string,
  ): string => {
    return `
      SELECT AirlineReview.id                                 as airlineReviewId,
            User.nickName,
            AirlineReview.score,
            AirlineReview.content,
            DATE_FORMAT(AirlineReview.createdAt, '%y.%m.%d') as createdAt
      FROM ReviewAirlineService
              join AirlineReview on AirlineReview.id = ReviewAirlineService.airlineReviewId
              join User on User.id = AirlineReview.userId
              join AirportService on AirportService.id = ReviewAirlineService.airlineServiceId
      WHERE AirlineReview.airlineId = ${airlineId}
        and AirlineReview.status = 'ACTIVE' ${filterQuery}
      group by AirlineReview.id
      order by AirlineReview.createdAt desc
      LIMIT ${offset}, ${pageSize};
    `;
  };

  retrieveAirlineReviewedServicesQuery = (airlineReviewId: number): string => {
    return `
      SELECT AirlineService.name
      FROM ReviewAirlineService
              join AirlineReview on AirlineReview.id = ReviewAirlineService.airlineReviewId
              join AirlineService on AirlineService.id = ReviewAirlineService.airlineServiceId
      WHERE AirlineReview.id = ${airlineReviewId}
      group by AirlineService.name;
    `;
  };

  retrieveAirlineReviewTimeQuery = (airlineReviewId: number): string => {
    return `
      SELECT AirlineReview.id
      FROM AirlineReview
      WHERE AirlineReview.id = ${airlineReviewId}
        and TIMESTAMPDIFF(hour, AirlineReview.createdAt, NOW()) < 48
        and TIMESTAMPDIFF(hour, AirlineReview.createdAt, NOW()) >= 0
    `;
  };

  retrieveAirlineReviewDeleteTimeQuery = (airlineReviewId: number): string => {
    return `
      SELECT AirlineReview.id
      FROM AirlineReview
      WHERE AirlineReview.id = ${airlineReviewId}
        and TIMESTAMPDIFF(day , AirlineReview.createdAt, NOW()) >= 30;
  `;
  };
}
