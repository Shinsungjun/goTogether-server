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
  GetSchedulesType,
  ReviewStatus,
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
    @InjectRepository(ScheduleAirlineService)
    private scheduleAirlineRepository: Repository<ScheduleAirlineService>,
    @InjectRepository(ScheduleAirportService)
    private scheduleAirportRepository: Repository<ScheduleAirportService>,
    @InjectRepository(AirportReview)
    private airportReviewRepository: Repository<AirportReview>,
    @InjectRepository(AirlineReview)
    private airlineReviewRepository: Repository<AirlineReview>,
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,

    private scheduleQuery: ScheduleQuery,
    private connection: DataSource,
  ) {}
  async createSchedule(postScheduleRequest: PostScheduleRequest) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // 존재하는 유저인지 확인
      if (!(await this.authService.isExistUser(postScheduleRequest.userId))) {
        return response.NON_EXIST_USER;
      }

      // 존재하는 공항인지 확인
      if (
        !(await this.airportRepository.findOneBy({
          id: postScheduleRequest.departureAirportId,
          status: Status.ACTIVE,
        })) ||
        !(await this.airportRepository.findOneBy({
          id: postScheduleRequest.arrivalAirportId,
          status: Status.ACTIVE,
        }))
      ) {
        return response.NON_EXIST_AIRPORT;
      }

      // 존재하는 항공사인지 확인
      if (
        !(await this.airlineRepository.findOneBy({
          id: postScheduleRequest.airlineId,
          status: Status.ACTIVE,
        }))
      ) {
        return response.NON_EXIST_AIRLINE;
      }

      // 일정 생성
      let scheduleRegister = new Schedule();
      scheduleRegister.name = postScheduleRequest.name;
      scheduleRegister.userId = postScheduleRequest.userId;
      scheduleRegister.startAt = postScheduleRequest.startAt;
      scheduleRegister.endAt = postScheduleRequest.endAt;
      scheduleRegister.departureAirportId =
        postScheduleRequest.departureAirportId;
      scheduleRegister.arrivalAirportId = postScheduleRequest.arrivalAirportId;
      scheduleRegister.airlineId = postScheduleRequest.airlineId;

      const createdSchedule = await queryRunner.manager.save(scheduleRegister);

      // 일정 공항 서비스 생성
      // 출발 서비스
      for (const departureAirportServiceId of postScheduleRequest.departureAirportServiceIds) {
        // 존재하는 서비스인지 확인
        if (
          !(await this.airportSerivceRepository.findOneBy({
            id: departureAirportServiceId,
            airportId: postScheduleRequest.departureAirportId,
            status: Status.ACTIVE,
          }))
        ) {
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
      // 도착 서비스
      for (const arrivalAirportServiceId of postScheduleRequest.arrivalAirportServiceIds) {
        // 존재하는 서비스인지 확인
        if (
          !(await this.airportSerivceRepository.findOneBy({
            id: arrivalAirportServiceId,
            airportId: postScheduleRequest.arrivalAirportId,
            status: Status.ACTIVE,
          }))
        ) {
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
      // 항공사 서비스
      for (const airlineServiceId of postScheduleRequest.airlineServiceIds) {
        // 존재하는 서비스인지 확인
        if (
          !(await this.airlineSerivceRepository.findOneBy({
            id: airlineServiceId,
            airlineId: postScheduleRequest.airlineId,
            status: Status.ACTIVE,
          }))
        ) {
          return response.NON_EXIST_AIRLINE_SERVICE;
        }
        let scheduleAirlineServiceRegister = new ScheduleAirlineService();
        scheduleAirlineServiceRegister.scheduleId = createdSchedule.id;
        scheduleAirlineServiceRegister.airlineServiceId = airlineServiceId;

        await queryRunner.manager.save(scheduleAirlineServiceRegister);
      }

      const data = {
        scheduleId: createdSchedule.id,
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

  async retrieveSchedules(
    userId: number,
    getSchedulesRequest: GetSchedulesRequest,
  ) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    try {
      let schedules;
      let data;
      // 등록된 일정
      if (getSchedulesRequest.type == 'future') {
        schedules = await queryRunner.query(
          this.scheduleQuery.retrieveFutureSchedulesQuery(userId),
        );
        data = {
          schedules: schedules,
        };
      } else if (getSchedulesRequest.type == 'past') {
        const pageSize = 5;
        const offset: number = pageSize * (getSchedulesRequest.page - 1);
        // 총 개수
        const total = await this.scheduleRepository
          .createQueryBuilder()
          .select('Schedule.id')
          .groupBy('Schedule.id')
          .where('Schedule.userId = (:userId)', { userId: userId })
          .andWhere('TIMESTAMPDIFF(DAY, now(), Schedule.startAt) <= -1')
          .getMany();

        // 존재하는 페이지인지 검증
        if (getSchedulesRequest.page > Math.ceil(total.length / pageSize)) {
          return response.NON_EXIST_PAGE;
        }

        // 정렬 기준
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

  // 일정 삭제
  async removeSchedule(
    userId: number,
    patchScheduleStatusRequest: PatchScheduleStatusRequest,
  ) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // 존재하는 일정인지 확인
      let schedule = await queryRunner.manager.findOneBy(Schedule, {
        id: patchScheduleStatusRequest.scheduleId,
        status: Status.ACTIVE,
      });
      if (!schedule) {
        return response.NON_EXIST_SCHEDULE;
      }

      // 해당 user의 일정인지 확인
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

  async retrieveSchedule(getScheduleRequest: GetScheduleRequest) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    try {
      let [schedule] = await queryRunner.query(
        this.scheduleQuery.retrieveScheduleQuery(getScheduleRequest.scheduleId),
      );

      if (!schedule) {
        return response.NON_EXIST_SCHEDULE;
      }

      // 출발 공항의 선택된 서비스 조회
      const departureAirportService = await queryRunner.query(
        this.scheduleQuery.retrieveScheduleAirportService(
          AirportServiceType.DEPARTURE,
          getScheduleRequest.scheduleId,
        ),
      );
      schedule['departureAirportService'] = departureAirportService.map(
        (x) => x.name,
      );

      const arrivalAirportService = await queryRunner.query(
        this.scheduleQuery.retrieveScheduleAirportService(
          AirportServiceType.ARRIVAL,
          getScheduleRequest.scheduleId,
        ),
      );
      schedule['arrivalAirportService'] = arrivalAirportService.map(
        (x) => x.name,
      );

      const airlineService = await queryRunner.query(
        this.scheduleQuery.retrieveScheduleAirlineService(
          getScheduleRequest.scheduleId,
        ),
      );
      schedule['airlineService'] = airlineService.map((x) => x.name);

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

  async editSchedule(
    userId: Number,
    patchScheduleRequest: PatchScheduleRequest,
  ) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // 존재하는 일정인지 확인
      let schedule = await queryRunner.manager.findOneBy(Schedule, {
        id: patchScheduleRequest.scheduleId,
        status: Status.ACTIVE,
      });
      if (!schedule) {
        return response.NON_EXIST_SCHEDULE;
      }

      // 해당 user의 일정인지 확인
      if (schedule.userId != userId) {
        return response.SCHEDULE_USER_PERMISSION_DENIED;
      }

      // update schedule
      await queryRunner.manager.update(
        Schedule,
        { id: patchScheduleRequest.scheduleId },
        {
          startAt: patchScheduleRequest.startAt,
          endAt: patchScheduleRequest.endAt,
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
      // 출발 서비스
      for (const departureAirportServiceId of patchScheduleRequest.departureAirportServiceIds) {
        // 존재하는 서비스인지 확인
        if (
          !(await this.airportSerivceRepository.findOneBy({
            id: departureAirportServiceId,
            airportId: patchScheduleRequest.departureAirportId,
            status: Status.ACTIVE,
          }))
        ) {
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
      // 도착 서비스
      for (const arrivalAirportServiceId of patchScheduleRequest.arrivalAirportServiceIds) {
        // 존재하는 서비스인지 확인
        if (
          !(await this.airportSerivceRepository.findOneBy({
            id: arrivalAirportServiceId,
            airportId: patchScheduleRequest.arrivalAirportId,
            status: Status.ACTIVE,
          }))
        ) {
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
      // 항공사 서비스
      for (const airlineServiceId of patchScheduleRequest.airlineServiceIds) {
        // 존재하는 서비스인지 확인
        if (
          !(await this.airlineSerivceRepository.findOneBy({
            id: airlineServiceId,
            airlineId: patchScheduleRequest.airlineId,
            status: Status.ACTIVE,
          }))
        ) {
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

  async retrieveScheduleReviews(
    userId: number,
    getScheduleReviewsRequest: GetScheduleReviewsRequest,
  ) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    try {
      // 존재하는 일정인지 확인
      let schedule = await queryRunner.manager.findOneBy(Schedule, {
        id: getScheduleReviewsRequest.scheduleId,
        status: Status.ACTIVE,
      });
      if (!schedule) {
        return response.NON_EXIST_SCHEDULE;
      }

      // 해당 user의 일정인지 확인
      if (schedule.userId != userId) {
        return response.SCHEDULE_USER_PERMISSION_DENIED;
      }

      let [departureAirport] = await queryRunner.query(
        this.scheduleQuery.retrieveScheduleDepartureAirport(
          getScheduleReviewsRequest.scheduleId,
        ),
      );
      const departureAirportServices = await queryRunner.query(
        this.scheduleQuery.retrieveScheduleAirportService(
          AirportServiceType.DEPARTURE,
          getScheduleReviewsRequest.scheduleId,
        ),
      );
      departureAirport['airportServices'] = departureAirportServices;
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

      let [arrivalAirport] = await queryRunner.query(
        this.scheduleQuery.retrieveScheduleArrivalAirport(
          getScheduleReviewsRequest.scheduleId,
        ),
      );
      const arrivalAirportServices = await queryRunner.query(
        this.scheduleQuery.retrieveScheduleAirportService(
          AirportServiceType.ARRIVAL,
          getScheduleReviewsRequest.scheduleId,
        ),
      );
      arrivalAirport['airportServices'] = arrivalAirportServices;
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

      let [airline] = await queryRunner.query(
        this.scheduleQuery.retrieveScheduleAirline(
          getScheduleReviewsRequest.scheduleId,
        ),
      );
      const airlineServices = await queryRunner.query(
        this.scheduleQuery.retrieveScheduleAirlineService(
          getScheduleReviewsRequest.scheduleId,
        ),
      );
      airline['airlineServices'] = airlineServices;
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

      const data = {
        departureAirport: departureAirport,
        arrivalAirport: arrivalAirport,
        airline: airline,
      };

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
      let [homeSchedule] = await queryRunner.query(
        this.scheduleQuery.retrieveHomeSchedule(userId),
      );

      if (homeSchedule) {
        // 출발 공항의 선택된 서비스 조회
        const departureAirportService = await queryRunner.query(
          this.scheduleQuery.retrieveScheduleAirportService(
            AirportServiceType.DEPARTURE,
            homeSchedule.scheduleId,
          ),
        );
        homeSchedule['departureAirportService'] = departureAirportService.map(
          (x) => x.name,
        );

        const arrivalAirportService = await queryRunner.query(
          this.scheduleQuery.retrieveScheduleAirportService(
            AirportServiceType.ARRIVAL,
            homeSchedule.scheduleId,
          ),
        );
        homeSchedule['arrivalAirportService'] = arrivalAirportService.map(
          (x) => x.name,
        );

        const airlineService = await queryRunner.query(
          this.scheduleQuery.retrieveScheduleAirlineService(
            homeSchedule.scheduleId,
          ),
        );
        homeSchedule['airlineService'] = airlineService.map((x) => x.name);
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
