import { Injectable } from '@nestjs/common';

@Injectable()
export class AirportQuery {
  retrieveAirportQuery = (airportId: number): string => {
    return `
      SELECT Airport.id   as airportId,
            Airport.name as airportName,
            Airport.customerServiceNumber,
            Airport.website,
            IF(avgReview.avgReview is null, 0, avgReview.avgReview) as avgReview,
            Airport.availableAt
      FROM Airport
              left join (select round(avg(score), 1) as avgReview, airportId
                    from AirportReview
                    where status = 'ACTIVE'
                    group by airportId) avgReview
                    on avgReview.airportId = Airport.id
      WHERE Airport.id = ${airportId}
      group by Airport.id
    `;
  };

  retrieveTotalAirportReviewsQuery = (
    airportId: number,
    filterQuery: string,
  ): string => {
    return `
      SELECT AirportReview.id as airportReviewId,
            User.nickName,
            AirportReview.score,
            AirportReview.content,
            DATE_FORMAT(AirportReview.createdAt, '%Y.%m.%d') as createdAt
      FROM ReviewAirportService
          join AirportReview on AirportReview.id = ReviewAirportService.airportReviewId
          join User on User.id = AirportReview.userId
          join AirportService on AirportService.id = ReviewAirportService.airportServiceId
      WHERE AirportReview.airportId = ${airportId} and AirportReview.status = 'ACTIVE' ${filterQuery}
      group by AirportReview.id
      order by AirportReview.createdAt desc
    `;
  };

  retrieveAirportReviewsQuery = (
    airportId: number,
    offset: number,
    pageSize: number,
    filterQuery: string,
  ): string => {
    return `
      SELECT AirportReview.id as airportReviewId,
            User.nickName,
            AirportReview.score,
            AirportReview.content,
            DATE_FORMAT(AirportReview.createdAt, '%y.%m.%d') as createdAt
      FROM ReviewAirportService
          join AirportReview on AirportReview.id = ReviewAirportService.airportReviewId
          join User on User.id = AirportReview.userId
          join AirportService on AirportService.id = ReviewAirportService.airportServiceId
      WHERE AirportReview.airportId = ${airportId} and AirportReview.status = 'ACTIVE' ${filterQuery}
      group by AirportReview.id
      order by AirportReview.createdAt desc
      LIMIT ${offset}, ${pageSize};
    `;
  };

  retrieveAirportReviewedServices = (airportReviewId: number): string => {
    return `
      SELECT AirportService.name
      FROM ReviewAirportService
          join AirportReview on AirportReview.id = ReviewAirportService.airportReviewId
          join AirportService on AirportService.id = ReviewAirportService.airportServiceId
      WHERE AirportReview.id = ${airportReviewId}
      group by AirportService.name;
    `;
  };
}
