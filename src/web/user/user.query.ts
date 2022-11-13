import { Injectable } from '@nestjs/common';

@Injectable()
export class UserQuery {
  retrieveUserAirlineReviewsQuery = (userId: number): string => {
    return `
      SELECT AirlineReview.id,
            Airline.name,
            Airline.logoImageUrl,
            AirlineReview.score,
            AirlineReview.content,
            DATE_FORMAT(AirlineReview.createdAt, '%y.%m.%d') as createdAt
      FROM ReviewAirlineService
              join AirlineReview on AirlineReview.id = ReviewAirlineService.airlineReviewId
              join User on User.id = AirlineReview.userId
              join AirportService on AirportService.id = ReviewAirlineService.airlineServiceId
              join Airline on Airline.id = AirlineReview.airlineId
      WHERE AirlineReview.status = 'ACTIVE'
        and AirlineReview.userId = ${userId}
      group by AirlineReview.id
      order by AirlineReview.createdAt desc;
    `;
  };

  retrieveUserAirportReviewsQuery = (userId: number): string => {
    return `
      SELECT AirportReview.id,
            Airport.name,
            Airport.region,
            AirportReview.score,
            AirportReview.content,
            DATE_FORMAT(AirportReview.createdAt, '%y.%m.%d') as createdAt
      FROM ReviewAirportService
              join AirportReview on AirportReview.id = ReviewAirportService.airportReviewId
              join User on User.id = AirportReview.userId
              join AirportService on AirportService.id = ReviewAirportService.airportServiceId
              join Airport on Airport.id = AirportReview.airportId
      WHERE AirportReview.userId = ${userId}
        and AirportReview.status = 'ACTIVE'
      group by AirportReview.id
      order by AirportReview.createdAt desc
    `;
  };

  retrieveDeletedUserByPhoneNumber = (phoneNumber: string) => {
    return `
      SELECT User.id
      FROM User
      WHERE User.phoneNumber = ${phoneNumber}
        and User.accountStatus = 'DELETED'
        and TIMESTAMPDIFF(day, User.createdAt, NOW()) < 7;
    `;
  };
}
