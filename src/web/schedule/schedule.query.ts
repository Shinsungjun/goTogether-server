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
      WHERE TIMESTAMPDIFF(DAY, now(), Schedule.startAt) <= -1 and Schedule.userId = ${userId} and Schedule.status = 'ACTIVE'
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
      WHERE TIMESTAMPDIFF(DAY, now(), Schedule.startAt) > -1 and Schedule.userId = ${userId} and Schedule.status = 'ACTIVE'
      group by Schedule.id
      order by Schedule.startAt;
    `;
  };

  retrieveScheduleQuery = (scheduleId: number): string => {
    return `
      SELECT Schedule.id                                 as scheduleId,
            Schedule.name                               as scheduleName,
            DATE_FORMAT(Schedule.startAt, '%Y.%m.%d')   as startAt,
            case
                when TIMESTAMPDIFF(DAY, now(), Schedule.startAt) = 0 then 'D-DAY'
                when TIMESTAMPDIFF(DAY, now(), Schedule.startAt) < 0 then null
                else CONCAT('D-', TIMESTAMPDIFF(DAY, now(), Schedule.startAt))
                end                                     as leftDay,
            Schedule.departureAirportId,
            departureAirport.name                       as departureAirportName,
            departureAirport.region                     as departureAirportRegion,
            departureAirport.customerServiceNumber      as departureAirportCustomerServiceNumber,
            departureAirport.website                    as departureAirportWebsite,
            IFNULL(departureAirportReview.avgReview, 0) as departureAirportAvgReview,
            Schedule.arrivalAirportId,
            arrivalAirport.name                         as arrivalAirportName,
            arrivalAirport.region                       as arrivalAirportRegion,
            arrivalAirport.customerServiceNumber        as arrivalAirportCustomerServiceNumber,
            arrivalAirport.website                      as arrivalAirportWebsite,
            IFNULL(arrivalAirportReview.avgReview, 0)   as arrivalAirportAvgReview,
            Schedule.airlineId,
            Airline.name                                as airlineName,
            Airline.logoImageUrl,
            Airline.customerServiceNumber               as airlineCustomerServiceNumber,
            Airline.website                             as airlineWebsite,
            airlineReview.avgReview                     as airlineAvgReview
      FROM Schedule
              join Airport as departureAirport on departureAirport.id = Schedule.departureAirportId
              join Airport as arrivalAirport on arrivalAirport.id = Schedule.arrivalAirportId
              join Airline on Airline.id = Schedule.airlineId
              left join (select round(avg(score), 1) as avgReview, airportId
                          from AirportReview
                          where status = 'ACTIVE'
                          group by airportId) departureAirportReview
                        on departureAirportReview.airportId = departureAirport.id
              left join (select round(avg(score), 1) as avgReview, airportId
                          from AirportReview
                          where status = 'ACTIVE'
                          group by airportId) arrivalAirportReview
                        on arrivalAirportReview.airportId = arrivalAirport.id
              left join (select round(avg(score), 1) as avgReview, airlineId
                          from AirlineReview
                          where status = 'ACTIVE'
                          group by airlineId) airlineReview
                        on airlineReview.airlineId = Airline.id
      WHERE Schedule.id = ${scheduleId};
    `;
  };

  retrieveScheduleAirportServices = (
    type: string,
    scheduleId: number,
  ): string => {
    return `
      SELECT AirportService.id as airportServiceId,
            AirportService.name,
            AirportService.website
      FROM ScheduleAirportService
              join AirportService on AirportService.id = ScheduleAirportService.airportServiceId
      WHERE ScheduleAirportService.scheduleId = ${scheduleId}
        and ScheduleAirportService.status = 'ACTIVE'
        and ScheduleAirportService.type = '${type}';
    `;
  };

  retrieveScheduleAirlineServices = (scheduleId: number): string => {
    return `
        SELECT AirlineService.id as airlineServiceId, 
              AirlineService.name,
              AirlineService.website
        FROM ScheduleAirlineService
                join AirlineService on AirlineService.id = ScheduleAirlineService.airlineServiceId
        WHERE ScheduleAirlineService.scheduleId = ${scheduleId}
          and ScheduleAirlineService.status = 'ACTIVE';
      `;
  };

  retrieveScheduleDepartureAirport = (scheduleId: number): string => {
    return `
      SELECT Schedule.departureAirportId as airportId,
            Airport.name as airportName,
            Airport.region
      FROM Schedule
              join Airport on Airport.id = Schedule.departureAirportId
      WHERE Schedule.id = ${scheduleId};
    `;
  };

  retrieveScheduleArrivalAirport = (scheduleId: number): string => {
    return `
      SELECT Schedule.arrivalAirportId as airportId,
            Airport.name as airportName,
            Airport.region
      FROM Schedule
              join Airport on Airport.id = Schedule.arrivalAirportId
      WHERE Schedule.id = ${scheduleId};
    `;
  };

  retrieveScheduleAirline = (scheduleId: number): string => {
    return `
      SELECT Schedule.airlineId,
            Airline.name                as airlineName,
            Airline.logoImageUrl
      FROM Schedule
              join Airline on Airline.id = Schedule.airlineId
      WHERE Schedule.id = ${scheduleId};
    `;
  };

  retrieveHomeSchedule = (userId: number): string => {
    return `
      SELECT Schedule.id                                                   as scheduleId,
            Schedule.name                                                 as scheduleName,
            DATE_FORMAT(Schedule.startAt, '%Y.%m.%d')                     as startAt,
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
      WHERE TIMESTAMPDIFF(DAY, now(), Schedule.startAt) <= 3
        and TIMESTAMPDIFF(DAY, now(), Schedule.startAt) >= 0
        and Schedule.userId = ${userId}
        and Schedule.status = 'ACTIVE'
      order by Schedule.startAt
      LIMIT 1;
    `;
  };
}
