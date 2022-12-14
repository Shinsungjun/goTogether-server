import { Injectable } from '@nestjs/common';
import { response } from 'config/response.utils';
import { PostScheduleRequest } from './dto/post-schedule.request';
import { AuthService } from '../auth/auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Airport } from 'src/entity/airport.entity';
import { DataSource, Repository } from 'typeorm';
import { Airline } from 'src/entity/airline.entity';
import {
  AirportServiceType,
  ReviewStatus,
  ScheduleReviewStatus,
  Status,
} from 'common/variable.utils';
import { AirportService } from 'src/entity/airportSerivce.entity';
import { AirlineService } from 'src/entity/airlineService.entity';
import { ScheduleAirlineService } from 'src/entity/scheduleAirlineService.entity';
import { ScheduleAirportService } from 'src/entity/scheduleAirportService.entity';
import { Schedule } from 'src/entity/schedule.entity';
import { makeResponse } from 'common/function.utils';
import { GetSchedulesRequest } from './dto/get-schedules.request';
import { ScheduleQuery } from './schedule.query';
import { PatchScheduleStatusRequest } from './dto/patch-schedule-status.request';
import { GetScheduleRequest } from './dto/get-schedule.request';
import { PatchScheduleRequest } from './dto/patch-schedule.request';
import { GetScheduleReviewsRequest } from './dto/get-schedule-reviews.request';
import { AirportReview } from 'src/entity/airportReview.entity';
import { AirlineReview } from 'src/entity/airlineReview.entity';

@Injectable()
export class ScheduleService {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(Airport)
    private airportRepository: Repository<Airport>,
    @InjectRepository(Airline)
    private airlineRepository: Repository<Airline>,
    @InjectRepository(AirportService)
    private airportSerivceRepository: Repository<AirportService>,
    @InjectRepository(AirlineService)
    private airlineSerivceRepository: Repository<AirlineService>,
    @InjectRepository(AirportReview)
    private airportReviewRepository: Repository<AirportReview>,
    @InjectRepository(AirlineReview)
    private airlineReviewRepository: Repository<AirlineReview>,
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
    @InjectRepository(ScheduleAirlineService)
    private scheduleAirlineServiceRepository: Repository<ScheduleAirlineService>,
    @InjectRepository(ScheduleAirportService)
    private scheduleAirportServiceRepository: Repository<ScheduleAirportService>,

    private scheduleQuery: ScheduleQuery,
    private connection: DataSource,
  ) {}

  // ?????? ??????
  async createSchedule(postScheduleRequest: PostScheduleRequest) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // ???????????? ???????????? ??????
      if (!(await this.authService.isExistUser(postScheduleRequest.userId))) {
        return response.NON_EXIST_USER;
      }

      // ???????????? ???????????? ??????
      const departureAirport = await this.airportRepository.findOneBy({
        id: postScheduleRequest.departureAirportId,
        status: Status.ACTIVE,
      });
      const arrivalAirport = await this.airportRepository.findOneBy({
        id: postScheduleRequest.arrivalAirportId,
        status: Status.ACTIVE,
      });
      if (!departureAirport || !arrivalAirport) {
        return response.NON_EXIST_AIRPORT;
      }

      // ???????????? ??????????????? ??????
      const airline = await this.airlineRepository.findOneBy({
        id: postScheduleRequest.airlineId,
        status: Status.ACTIVE,
      });
      if (!airline) {
        return response.NON_EXIST_AIRLINE;
      }

      // ?????? ??????
      let scheduleRegister = new Schedule();
      scheduleRegister.name = postScheduleRequest.name;
      scheduleRegister.userId = postScheduleRequest.userId;
      scheduleRegister.startAt = postScheduleRequest.startAt;
      scheduleRegister.departureAirportId =
        postScheduleRequest.departureAirportId;
      scheduleRegister.arrivalAirportId = postScheduleRequest.arrivalAirportId;
      scheduleRegister.airlineId = postScheduleRequest.airlineId;

      const createdSchedule = await queryRunner.manager.save(scheduleRegister);

      // ?????? ?????? ????????? ??????
      // ?????? ?????????
      for (const departureAirportServiceId of postScheduleRequest.departureAirportServiceIds) {
        // ???????????? ??????????????? ??????
        if (
          !(await this.airportSerivceRepository.findOneBy({
            id: departureAirportServiceId,
            airportId: postScheduleRequest.departureAirportId,
            status: Status.ACTIVE,
          }))
        ) {
          await queryRunner.rollbackTransaction();
          return response.NON_EXIST_AIRPORT_SERVICE;
        }
        let departureScheduleAirportServiceRegister =
          new ScheduleAirportService();
        departureScheduleAirportServiceRegister.scheduleId = createdSchedule.id;
        departureScheduleAirportServiceRegister.airportServiceId =
          departureAirportServiceId;
        departureScheduleAirportServiceRegister.type =
          AirportServiceType.DEPARTURE;
        await queryRunner.manager.save(departureScheduleAirportServiceRegister);
      }

      // ?????? ?????????
      for (const arrivalAirportServiceId of postScheduleRequest.arrivalAirportServiceIds) {
        // ???????????? ??????????????? ??????
        if (
          !(await this.airportSerivceRepository.findOneBy({
            id: arrivalAirportServiceId,
            airportId: postScheduleRequest.arrivalAirportId,
            status: Status.ACTIVE,
          }))
        ) {
          await queryRunner.rollbackTransaction();
          return response.NON_EXIST_AIRPORT_SERVICE;
        }
        let arrivalScheduleAirportServiceRegister =
          new ScheduleAirportService();
        arrivalScheduleAirportServiceRegister.scheduleId = createdSchedule.id;
        arrivalScheduleAirportServiceRegister.airportServiceId =
          arrivalAirportServiceId;
        arrivalScheduleAirportServiceRegister.type = AirportServiceType.ARRIVAL;
        await queryRunner.manager.save(arrivalScheduleAirportServiceRegister);
      }

      // ????????? ?????????
      for (const airlineServiceId of postScheduleRequest.airlineServiceIds) {
        // ???????????? ??????????????? ??????
        if (
          !(await this.airlineSerivceRepository.findOneBy({
            id: airlineServiceId,
            airlineId: postScheduleRequest.airlineId,
            status: Status.ACTIVE,
          }))
        ) {
          await queryRunner.rollbackTransaction();
          return response.NON_EXIST_AIRLINE_SERVICE;
        }
        let scheduleAirlineServiceRegister = new ScheduleAirlineService();
        scheduleAirlineServiceRegister.scheduleId = createdSchedule.id;
        scheduleAirlineServiceRegister.airlineServiceId = airlineServiceId;

        await queryRunner.manager.save(scheduleAirlineServiceRegister);
      }

      // ?????? ?????? ????????? ????????? ??????
      let departureAirportServices = await queryRunner.query(
        this.scheduleQuery.retrieveScheduleAirportServices(
          AirportServiceType.DEPARTURE,
          createdSchedule.id,
        ),
      );
      departureAirportServices = departureAirportServices.map((x) => x.name);

      // ?????? ?????? ????????? ????????? ??????
      let arrivalAirportServices = await queryRunner.query(
        this.scheduleQuery.retrieveScheduleAirportServices(
          AirportServiceType.ARRIVAL,
          createdSchedule.id,
        ),
      );
      arrivalAirportServices = arrivalAirportServices.map((x) => x.name);

      // ????????? ????????? ????????? ??????
      let airlineServices = await queryRunner.query(
        this.scheduleQuery.retrieveScheduleAirlineServices(createdSchedule.id),
      );
      airlineServices = airlineServices.map((x) => x.name);

      const createdScheduleInfo = {
        scheduleId: createdSchedule.id,
        scheduleName: postScheduleRequest.name,
        startAt:
          postScheduleRequest.startAt.slice(2, 4) +
          '.' +
          postScheduleRequest.startAt.slice(5, 7) +
          '.' +
          postScheduleRequest.startAt.slice(8, 10),
        departureAirportName: departureAirport.name,
        arrivalAiportName: arrivalAirport.name,
        airlineName: airline.name,
        departureAirportService: departureAirportServices,
        arrivalAirportService: arrivalAirportServices,
        airlineService: airlineServices,
      };

      const data = {
        createdSchedule: createdScheduleInfo,
      };

      const result = makeResponse(response.SUCCESS, data);

      await queryRunner.commitTransaction();

      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return response.ERROR;
    } finally {
      await queryRunner.release();
    }
  }

  // ?????? ????????? ??????
  async retrieveSchedules(
    userId: number,
    getSchedulesRequest: GetSchedulesRequest,
  ) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    try {
      let schedules;
      let data;
      // ????????? ?????? ????????? ??????
      if (getSchedulesRequest.type == 'future') {
        schedules = await queryRunner.query(
          this.scheduleQuery.retrieveFutureSchedulesQuery(userId),
        );
        data = {
          schedules: schedules,
        };
      } else if (getSchedulesRequest.type == 'past') {
        // ?????? ?????? ????????? ??????

        // ?????????
        const pageSize = 10;
        const offset: number = pageSize * (getSchedulesRequest.page - 1);
        // ??? ??????
        const total = await this.scheduleRepository
          .createQueryBuilder()
          .select('Schedule.id')
          .groupBy('Schedule.id')
          .where('Schedule.userId = (:userId)', { userId: userId })
          .andWhere('TIMESTAMPDIFF(DAY, now(), Schedule.startAt) <= -1')
          .andWhere('Schedule.status = (:status)', { status: Status.ACTIVE })
          .getMany();

        // ???????????? ??????????????? ??????
        if (getSchedulesRequest.page > Math.ceil(total.length / pageSize)) {
          return response.NON_EXIST_PAGE;
        }

        // ?????? ??????
        let sortType: string;
        if (getSchedulesRequest.sort == 'latest') {
          sortType = 'order by Schedule.createdAt desc';
        }
        if (getSchedulesRequest.sort == 'oldest') {
          sortType = 'order by Schedule.createdAt';
        }
        if (getSchedulesRequest.sort == 'boardingTime') {
          sortType = 'order by Schedule.startAt, Schedule.createdAt desc';
        }

        schedules = await queryRunner.query(
          this.scheduleQuery.retrievePastSchedulesQuery(
            userId,
            offset,
            pageSize,
            sortType,
          ),
        );

        // ?????? ?????? ?????? ??????
        for (let schedule of schedules) {
          // ?????? ????????? ??????
          let serviceCount = 0;

          // ????????? ????????? ?????? ?????? ??????
          if (
            await this.scheduleAirlineServiceRepository.findOneBy({
              scheduleId: schedule.scheduleId,
              status: Status.ACTIVE,
            })
          ) {
            serviceCount = serviceCount + 1;
          }

          // ??????(??????) ????????? ?????? ?????? ??????
          const a = await this.scheduleAirportServiceRepository.findOneBy({
            scheduleId: schedule.scheduleId,
            type: AirportServiceType.DEPARTURE,
            status: Status.ACTIVE,
          });
          if (a) {
            serviceCount = serviceCount + 1;
          }

          // ??????(??????) ????????? ?????? ?????? ??????
          if (
            await this.scheduleAirportServiceRepository.findOneBy({
              scheduleId: schedule.scheduleId,
              type: AirportServiceType.ARRIVAL,
              status: Status.ACTIVE,
            })
          ) {
            serviceCount = serviceCount + 1;
          }

          // ?????? ?????? ??????
          let reviewCount = 0;
          const airlineReview = await this.airlineReviewRepository.find({
            where: {
              scheduleId: schedule.scheduleId,
              userId: userId,
              status: Status.ACTIVE,
            },
          });
          reviewCount = reviewCount + airlineReview.length;

          const airportReview = await this.airportReviewRepository.find({
            where: {
              scheduleId: schedule.scheduleId,
              userId: userId,
              status: Status.ACTIVE,
            },
          });
          reviewCount = reviewCount + airportReview.length;

          // ?????? ?????? ?????? ??? ?????? ?????????
          if (reviewCount >= serviceCount) {
            schedule.reviewStatus = ScheduleReviewStatus.COMPLETED;
          } else {
            schedule.reviewStatus = ScheduleReviewStatus.CAN_WRITE;
          }
        }

        data = {
          scheduleCount: total.length,
          schedules: schedules,
        };
      }

      const result = makeResponse(response.SUCCESS, data);

      return result;
    } catch (error) {
      return response.ERROR;
    } finally {
      await queryRunner.release();
    }
  }

  // ?????? ??????
  async removeSchedule(
    userId: number,
    patchScheduleStatusRequest: PatchScheduleStatusRequest,
  ) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // ???????????? ???????????? ??????
      let schedule = await queryRunner.manager.findOneBy(Schedule, {
        id: patchScheduleStatusRequest.scheduleId,
        status: Status.ACTIVE,
      });
      if (!schedule) {
        return response.NON_EXIST_SCHEDULE;
      }

      // ?????? user??? ???????????? ??????
      if (schedule.userId != userId) {
        return response.SCHEDULE_USER_PERMISSION_DENIED;
      }

      // delete schedule
      await queryRunner.manager.update(
        Schedule,
        { id: patchScheduleStatusRequest.scheduleId },
        { status: Status.DELETED },
      );

      // delete schedule airport service
      await queryRunner.manager.update(
        ScheduleAirportService,
        {
          scheduleId: patchScheduleStatusRequest.scheduleId,
        },
        { status: Status.DELETED },
      );

      // delete schedule airline service
      await queryRunner.manager.update(
        ScheduleAirlineService,
        {
          scheduleId: patchScheduleStatusRequest.scheduleId,
        },
        { status: Status.DELETED },
      );

      const result = makeResponse(response.SUCCESS, undefined);

      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return response.ERROR;
    } finally {
      await queryRunner.release();
    }
  }

  // ?????? ?????? ??????
  async retrieveSchedule(getScheduleRequest: GetScheduleRequest) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    try {
      // ?????? ??????
      let [schedule] = await queryRunner.query(
        this.scheduleQuery.retrieveScheduleQuery(getScheduleRequest.scheduleId),
      );
      if (!schedule) {
        return response.NON_EXIST_SCHEDULE;
      }

      // ?????? ????????? ????????? ????????? ????????? ??????
      const departureAirportServices = await queryRunner.query(
        this.scheduleQuery.retrieveScheduleAirportServices(
          AirportServiceType.DEPARTURE,
          getScheduleRequest.scheduleId,
        ),
      );
      schedule['departureAirportService'] = departureAirportServices.map(
        (x) => x.name,
      );

      // ?????? ????????? ????????? ????????? ????????? ??????
      const arrivalAirportServices = await queryRunner.query(
        this.scheduleQuery.retrieveScheduleAirportServices(
          AirportServiceType.ARRIVAL,
          getScheduleRequest.scheduleId,
        ),
      );
      schedule['arrivalAirportService'] = arrivalAirportServices.map(
        (x) => x.name,
      );

      // ???????????? ????????? ????????? ????????? ??????
      const airlineServices = await queryRunner.query(
        this.scheduleQuery.retrieveScheduleAirlineServices(
          getScheduleRequest.scheduleId,
        ),
      );
      schedule['airlineService'] = airlineServices.map((x) => x.name);

      const data = {
        schedule: schedule,
      };
      const result = makeResponse(response.SUCCESS, data);

      return result;
    } catch (error) {
      return response.ERROR;
    } finally {
      await queryRunner.release();
    }
  }

  // ?????? ??????
  async editSchedule(
    userId: Number,
    patchScheduleRequest: PatchScheduleRequest,
  ) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // ???????????? ???????????? ??????
      let schedule = await queryRunner.manager.findOneBy(Schedule, {
        id: patchScheduleRequest.scheduleId,
        status: Status.ACTIVE,
      });
      if (!schedule) {
        return response.NON_EXIST_SCHEDULE;
      }

      // ?????? user??? ???????????? ??????
      if (schedule.userId != userId) {
        return response.SCHEDULE_USER_PERMISSION_DENIED;
      }

      // update schedule
      await queryRunner.manager.update(
        Schedule,
        { id: patchScheduleRequest.scheduleId },
        {
          startAt: patchScheduleRequest.startAt,
          departureAirportId: patchScheduleRequest.departureAirportId,
          arrivalAirportId: patchScheduleRequest.arrivalAirportId,
          airlineId: patchScheduleRequest.airlineId,
        },
      );

      // update scheduleDepartureAirportService
      await queryRunner.manager.delete(ScheduleAirportService, {
        scheduleId: patchScheduleRequest.scheduleId,
      });
      await queryRunner.manager.delete(ScheduleAirlineService, {
        scheduleId: patchScheduleRequest.scheduleId,
      });

      // create schedule departure airport serivces
      for (const departureAirportServiceId of patchScheduleRequest.departureAirportServiceIds) {
        // ???????????? ??????????????? ??????
        if (
          !(await this.airportSerivceRepository.findOneBy({
            id: departureAirportServiceId,
            airportId: patchScheduleRequest.departureAirportId,
            status: Status.ACTIVE,
          }))
        ) {
          await queryRunner.rollbackTransaction();
          return response.NON_EXIST_AIRPORT_SERVICE;
        }
        let departureScheduleAirportServiceRegister =
          new ScheduleAirportService();
        departureScheduleAirportServiceRegister.scheduleId =
          patchScheduleRequest.scheduleId;
        departureScheduleAirportServiceRegister.airportServiceId =
          departureAirportServiceId;
        departureScheduleAirportServiceRegister.type =
          AirportServiceType.DEPARTURE;
        await queryRunner.manager.save(departureScheduleAirportServiceRegister);
      }

      // create schedule arrival airport serivces
      for (const arrivalAirportServiceId of patchScheduleRequest.arrivalAirportServiceIds) {
        // ???????????? ??????????????? ??????
        if (
          !(await this.airportSerivceRepository.findOneBy({
            id: arrivalAirportServiceId,
            airportId: patchScheduleRequest.arrivalAirportId,
            status: Status.ACTIVE,
          }))
        ) {
          await queryRunner.rollbackTransaction();
          return response.NON_EXIST_AIRPORT_SERVICE;
        }
        let arrivalScheduleAirportServiceRegister =
          new ScheduleAirportService();
        arrivalScheduleAirportServiceRegister.scheduleId =
          patchScheduleRequest.scheduleId;
        arrivalScheduleAirportServiceRegister.airportServiceId =
          arrivalAirportServiceId;
        arrivalScheduleAirportServiceRegister.type = AirportServiceType.ARRIVAL;
        await queryRunner.manager.save(arrivalScheduleAirportServiceRegister);
      }

      // create schedule airline serivces
      for (const airlineServiceId of patchScheduleRequest.airlineServiceIds) {
        // ???????????? ??????????????? ??????
        if (
          !(await this.airlineSerivceRepository.findOneBy({
            id: airlineServiceId,
            airlineId: patchScheduleRequest.airlineId,
            status: Status.ACTIVE,
          }))
        ) {
          await queryRunner.rollbackTransaction();
          return response.NON_EXIST_AIRLINE_SERVICE;
        }
        let scheduleAirlineServiceRegister = new ScheduleAirlineService();
        scheduleAirlineServiceRegister.scheduleId =
          patchScheduleRequest.scheduleId;
        scheduleAirlineServiceRegister.airlineServiceId = airlineServiceId;

        await queryRunner.manager.save(scheduleAirlineServiceRegister);
      }

      const result = makeResponse(response.SUCCESS, undefined);

      await queryRunner.commitTransaction();

      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return response.ERROR;
    } finally {
      await queryRunner.release();
    }
  }

  // ?????? ?????? ????????? ??????
  async retrieveScheduleReviews(
    userId: number,
    getScheduleReviewsRequest: GetScheduleReviewsRequest,
  ) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    try {
      // result data
      let data = {};
      // ???????????? ???????????? ??????
      let schedule = await queryRunner.manager.findOneBy(Schedule, {
        id: getScheduleReviewsRequest.scheduleId,
        status: Status.ACTIVE,
      });
      if (!schedule) {
        return response.NON_EXIST_SCHEDULE;
      }

      // ?????? user??? ???????????? ??????
      if (schedule.userId != userId) {
        return response.SCHEDULE_USER_PERMISSION_DENIED;
      }

      // ?????? ?????? ????????? ????????? ??????
      const departureAirportServices = await queryRunner.query(
        this.scheduleQuery.retrieveScheduleAirportServices(
          AirportServiceType.DEPARTURE,
          getScheduleReviewsRequest.scheduleId,
        ),
      );
      // ????????? ????????? ?????? ?????? ?????? ?????? ??????
      if (departureAirportServices.length > 0) {
        // ?????? ?????? ?????? ??????
        let [departureAirport] = await queryRunner.query(
          this.scheduleQuery.retrieveScheduleDepartureAirport(
            getScheduleReviewsRequest.scheduleId,
          ),
        );

        departureAirport['airportServices'] = departureAirportServices;

        // ?????? ?????? ?????? ??????
        if (
          await this.airportReviewRepository.findOneBy({
            airportId: departureAirport.airportId,
            scheduleId: getScheduleReviewsRequest.scheduleId,
            userId: userId,
            status: Status.ACTIVE,
          })
        ) {
          departureAirport['reviewStatus'] = ReviewStatus.COMPLETED;
        } else {
          departureAirport['reviewStatus'] = ReviewStatus.BEFORE;
        }

        data['departureAirport'] = departureAirport;
      }

      // ?????? ?????? ????????? ????????? ??????
      const arrivalAirportServices = await queryRunner.query(
        this.scheduleQuery.retrieveScheduleAirportServices(
          AirportServiceType.ARRIVAL,
          getScheduleReviewsRequest.scheduleId,
        ),
      );
      // ????????? ????????? ?????? ?????? ?????? ?????? ??????
      if (arrivalAirportServices.length > 0) {
        // ?????? ?????? ?????? ??????
        let [arrivalAirport] = await queryRunner.query(
          this.scheduleQuery.retrieveScheduleArrivalAirport(
            getScheduleReviewsRequest.scheduleId,
          ),
        );
        arrivalAirport['airportServices'] = arrivalAirportServices;

        // ?????? ?????? ?????? ??????
        if (
          await this.airportReviewRepository.findOneBy({
            airportId: arrivalAirport.airportId,
            scheduleId: getScheduleReviewsRequest.scheduleId,
            userId: userId,
            status: Status.ACTIVE,
          })
        ) {
          arrivalAirport['reviewStatus'] = ReviewStatus.COMPLETED;
        } else {
          arrivalAirport['reviewStatus'] = ReviewStatus.BEFORE;
        }

        data['arrivalAirport'] = arrivalAirport;
      }

      // ????????? ????????? ????????? ??????
      const airlineServices = await queryRunner.query(
        this.scheduleQuery.retrieveScheduleAirlineServices(
          getScheduleReviewsRequest.scheduleId,
        ),
      );
      // ????????? ????????? ?????? ?????? ?????? ?????? ??????
      if (airlineServices.length > 0) {
        // ?????? ????????? ??????
        let [airline] = await queryRunner.query(
          this.scheduleQuery.retrieveScheduleAirline(
            getScheduleReviewsRequest.scheduleId,
          ),
        );
        airline['airlineServices'] = airlineServices;

        // ?????? ?????? ?????? ??????
        if (
          await this.airlineReviewRepository.findOneBy({
            airlineId: airline.airlineId,
            scheduleId: getScheduleReviewsRequest.scheduleId,
            userId: userId,
            status: Status.ACTIVE,
          })
        ) {
          airline['reviewStatus'] = ReviewStatus.COMPLETED;
        } else {
          airline['reviewStatus'] = ReviewStatus.BEFORE;
        }

        data['airline'] = airline;
      }

      const result = makeResponse(response.SUCCESS, data);

      return result;
    } catch (error) {
      return response.ERROR;
    } finally {
      await queryRunner.release();
    }
  }

  async retrieveHomeSchedule(userId: number) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    try {
      // ????????? ?????? ??????
      let [homeSchedule] = await queryRunner.query(
        this.scheduleQuery.retrieveHomeSchedule(userId),
      );

      if (homeSchedule) {
        // ?????? ????????? ????????? ????????? ??????
        const departureAirportServices = await queryRunner.query(
          this.scheduleQuery.retrieveScheduleAirportServices(
            AirportServiceType.DEPARTURE,
            homeSchedule.scheduleId,
          ),
        );
        homeSchedule['departureAirportService'] = departureAirportServices;

        const arrivalAirportServices = await queryRunner.query(
          this.scheduleQuery.retrieveScheduleAirportServices(
            AirportServiceType.ARRIVAL,
            homeSchedule.scheduleId,
          ),
        );
        homeSchedule['arrivalAirportService'] = arrivalAirportServices;
        const airlineServices = await queryRunner.query(
          this.scheduleQuery.retrieveScheduleAirlineServices(
            homeSchedule.scheduleId,
          ),
        );
        homeSchedule['airlineService'] = airlineServices;
      }

      const data = {
        schedule: homeSchedule,
      };
      const result = makeResponse(response.SUCCESS, data);

      return result;
    } catch (error) {
      return response.ERROR;
    } finally {
      await queryRunner.release();
    }
  }
}
