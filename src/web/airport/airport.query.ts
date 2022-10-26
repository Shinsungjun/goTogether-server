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
}
