import { Injectable } from '@nestjs/common';

@Injectable()
export class ScheduleQuery {
  retrievePastSchedulesQuery = (
    userId: number,
    offset: number,
    pageSize: number,
    sortType: string,
  ): string => {
    return `
      SELECT Schedule.id                                                   as scheduleId,
            Schedule.name                                                 as scheduleName,
            DATE_FORMAT(Schedule.startAt, '%Y.%m.%d')                     as startAt,
            DATE_FORMAT(Schedule.endAt, '%Y.%m.%d')                       as endAt,
            Schedule.departureAirportId,
            departureAirport.name                                         as departureAirportName,
            Schedule.arrivalAirportId,
            arrivalAirport.name                                           as arrivalAirportName,
            Schedule.airlineId,
            Airline.name                                                  as airlineName
      FROM Schedule
              join Airport as departureAirport on departureAirport.id = Schedule.departureAirportId
              join Airport as arrivalAirport on arrivalAirport.id = Schedule.arrivalAirportId
              join Airline on Airline.id = Schedule.airlineId
      WHERE TIMESTAMPDIFF(DAY, now(), Schedule.startAt) <= -1 and Schedule.userId = ${userId}
      group by Schedule.id
      ${sortType}
      LIMIT ${offset}, ${pageSize};
    `;
  };

  retrieveFutureSchedulesQuery = (userId: number): string => {
    return `
      SELECT Schedule.id                                                   as scheduleId,
            Schedule.name                                                 as scheduleName,
            DATE_FORMAT(Schedule.startAt, '%Y.%m.%d')                     as startAt,
            DATE_FORMAT(Schedule.endAt, '%Y.%m.%d')                       as endAt,
            IF(TIMESTAMPDIFF(DAY, now(), Schedule.startAt) = 0, 'D-DAY',
                CONCAT('D-', TIMESTAMPDIFF(DAY, now(), Schedule.startAt))) as leftDay,
            Schedule.departureAirportId,
            departureAirport.name                                         as departureAirportName,
            Schedule.arrivalAirportId,
            arrivalAirport.name                                           as arrivalAirportName,
            Schedule.airlineId,
            Airline.name                                                  as airlineName
      FROM Schedule
              join Airport as departureAirport on departureAirport.id = Schedule.departureAirportId
              join Airport as arrivalAirport on arrivalAirport.id = Schedule.arrivalAirportId
              join Airline on Airline.id = Schedule.airlineId
      WHERE TIMESTAMPDIFF(DAY, now(), Schedule.startAt) > -1 and Schedule.userId = ${userId}
      group by Schedule.id
      order by Schedule.startAt;
    `;
  };
}
