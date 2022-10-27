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
}
