import { Injectable } from '@nestjs/common';

@Injectable()
export class SearchQuery {
  retrieveAirportSearch = (searchQuery: string): string => {
    return `
      SELECT Airport.id,
            Airport.name,
            IFNULL(avgReview.avgReview, 0) as avgReview,
            Airport.customerServiceNumber,
            Airport.website
      FROM Airport
              left join (select round(avg(score), 1) as avgReview, airportId
                          from AirportReview
                          where status = 'ACTIVE'
                          group by airportId) avgReview
                        on avgReview.airportId = Airport.id
      WHERE Airport.name like '%${searchQuery}%'
      group by Airport.id;
    `;
  };

  retrieveAirlineSearch = (searchQuery: string): string => {
    return `
      SELECT Airline.id,
            Airline.name,
            IFNULL(avgReview.avgReview, 0) as avgReview,
            Airline.logoImageUrl,
            Airline.customerServiceNumber,
            Airline.website
      FROM Airline
              left join (select round(avg(score), 1) as avgReview, airlineId
                          from AirlineReview
                          where status = 'ACTIVE'
                          group by airlineId) avgReview
                        on avgReview.airlineId = Airline.id
      WHERE Airline.name like '%${searchQuery}%'
      group by Airline.id;
    `;
  };
}
