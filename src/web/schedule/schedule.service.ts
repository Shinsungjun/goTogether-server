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

  // 일정 등록
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

      // 존재하는 항공사인지 확인
      const airline = await this.airlineRepository.findOneBy({
        id: postScheduleRequest.airlineId,
        status: Status.ACTIVE,
      });
      if (!airline) {
        return response.NON_EXIST_AIRLINE;
      }

      // 일정 생성
      let scheduleRegister = new Schedule();
      scheduleRegister.name = postScheduleRequest.name;
      scheduleRegister.userId = postScheduleRequest.userId;
      scheduleRegister.startAt = postScheduleRequest.startAt;
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
          await queryRunner.rollbackTransaction();
          return response.NON_EXIST_AIRLINE_SERVICE;
        }
        let scheduleAirlineServiceRegister = new ScheduleAirlineService();
        scheduleAirlineServiceRegister.scheduleId = createdSchedule.id;
        scheduleAirlineServiceRegister.airlineServiceId = airlineServiceId;

        await queryRunner.manager.save(scheduleAirlineServiceRegister);
      }

      // 출발 공항 서비스 리스트 조회
      let departureAirportServices = await queryRunner.query(
        this.scheduleQuery.retrieveScheduleAirportServices(
          AirportServiceType.DEPARTURE,
          createdSchedule.id,
        ),
      );
      departureAirportServices = departureAirportServices.map((x) => x.name);

      // 도착 공항 서비스 리스트 조회
      let arrivalAirportServices = await queryRunner.query(
        this.scheduleQuery.retrieveScheduleAirportServices(
          AirportServiceType.ARRIVAL,
          createdSchedule.id,
        ),
      );
      arrivalAirportServices = arrivalAirportServices.map((x) => x.name);

      // 항공사 서비스 리스트 조회
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

  // 일정 리스트 조회
  async retrieveSchedules(
    userId: number,
    getSchedulesRequest: GetSchedulesRequest,
  ) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    try {
      let schedules;
      let data;
      // 등록된 일정 리스트 조회
      if (getSchedulesRequest.type == 'future') {
        schedules = await queryRunner.query(
          this.scheduleQuery.retrieveFutureSchedulesQuery(userId),
        );
        data = {
          schedules: schedules,
        };
      } else if (getSchedulesRequest.type == 'past') {
        // 지난 일정 리스트 조회

        // 페이징
        const pageSize = 10;
        const offset: number = pageSize * (getSchedulesRequest.page - 1);
        // 총 개수
        const total = await this.scheduleRepository
          .createQueryBuilder()
          .select('Schedule.id')
          .groupBy('Schedule.id')
          .where('Schedule.userId = (:userId)', { userId: userId })
          .andWhere('TIMESTAMPDIFF(DAY, now(), Schedule.startAt) <= -1')
          .andWhere('Schedule.status = (:status)', { status: Status.ACTIVE })
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

        // 리뷰 작성 가능 여부
        for (let schedule of schedules) {
          // 이용 서비스 개수
          let serviceCount = 0;

          // 항공사 서비스 이용 여부 확인
          if (
            await this.scheduleAirlineServiceRepository.findOneBy({
              scheduleId: schedule.scheduleId,
              status: Status.ACTIVE,
            })
          ) {
            serviceCount = serviceCount + 1;
          }

          // 공항(출발) 서비스 이용 여부 확인
          const a = await this.scheduleAirportServiceRepository.findOneBy({
            scheduleId: schedule.scheduleId,
            type: AirportServiceType.DEPARTURE,
            status: Status.ACTIVE,
          });
          if (a) {
            serviceCount = serviceCount + 1;
          }

          // 공항(도착) 서비스 이용 여부 확인
          if (
            await this.scheduleAirportServiceRepository.findOneBy({
              scheduleId: schedule.scheduleId,
              type: AirportServiceType.ARRIVAL,
              status: Status.ACTIVE,
            })
          ) {
            serviceCount = serviceCount + 1;
          }

          // 리뷰 작성 개수
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

          // 리뷰 전부 작성 시 작성 불가능
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

  // 일정 상세 조회
  async retrieveSchedule(getScheduleRequest: GetScheduleRequest) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    try {
      // 일정 조회
      let [schedule] = await queryRunner.query(
        this.scheduleQuery.retrieveScheduleQuery(getScheduleRequest.scheduleId),
      );
      if (!schedule) {
        return response.NON_EXIST_SCHEDULE;
      }

      // 출발 공항의 선택된 서비스 리스트 조회
      const departureAirportServices = await queryRunner.query(
        this.scheduleQuery.retrieveScheduleAirportServices(
          AirportServiceType.DEPARTURE,
          getScheduleRequest.scheduleId,
        ),
      );
      schedule['departureAirportService'] = departureAirportServices.map(
        (x) => x.name,
      );

      // 도착 공항의 선택된 서비스 리스트 조회
      const arrivalAirportServices = await queryRunner.query(
        this.scheduleQuery.retrieveScheduleAirportServices(
          AirportServiceType.ARRIVAL,
          getScheduleRequest.scheduleId,
        ),
      );
      schedule['arrivalAirportService'] = arrivalAirportServices.map(
        (x) => x.name,
      );

      // 항공사의 선택된 서비스 리스트 조회
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

  // 일정 수정
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
        // 존재하는 서비스인지 확인
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
        // 존재하는 서비스인지 확인
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
        // 존재하는 서비스인지 확인
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

  // 일정 리뷰 리스트 조회
  async retrieveScheduleReviews(
    userId: number,
    getScheduleReviewsRequest: GetScheduleReviewsRequest,
  ) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    try {
      // result data
      let data = {};
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

      // 출발 공항 서비스 리스트 조회
      const departureAirportServices = await queryRunner.query(
        this.scheduleQuery.retrieveScheduleAirportServices(
          AirportServiceType.DEPARTURE,
          getScheduleReviewsRequest.scheduleId,
        ),
      );
      // 사용한 서비스 있을 때만 리뷰 작성 가능
      if (departureAirportServices.length > 0) {
        // 일정 출발 공항 조회
        let [departureAirport] = await queryRunner.query(
          this.scheduleQuery.retrieveScheduleDepartureAirport(
            getScheduleReviewsRequest.scheduleId,
          ),
        );

        departureAirport['airportServices'] = departureAirportServices;

        // 리뷰 작성 상태 조회
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

      // 도착 공항 서비스 리스트 조회
      const arrivalAirportServices = await queryRunner.query(
        this.scheduleQuery.retrieveScheduleAirportServices(
          AirportServiceType.ARRIVAL,
          getScheduleReviewsRequest.scheduleId,
        ),
      );
      // 사용한 서비스 있을 때만 리뷰 작성 가능
      if (arrivalAirportServices.length > 0) {
        // 일정 도착 공항 조회
        let [arrivalAirport] = await queryRunner.query(
          this.scheduleQuery.retrieveScheduleArrivalAirport(
            getScheduleReviewsRequest.scheduleId,
          ),
        );
        arrivalAirport['airportServices'] = arrivalAirportServices;

        // 리뷰 작성 상태 조회
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

      // 항공사 서비스 리스트 조회
      const airlineServices = await queryRunner.query(
        this.scheduleQuery.retrieveScheduleAirlineServices(
          getScheduleReviewsRequest.scheduleId,
        ),
      );
      // 사용한 서비스 있을 때만 리뷰 작성 가능
      if (airlineServices.length > 0) {
        // 일정 항공사 조회
        let [airline] = await queryRunner.query(
          this.scheduleQuery.retrieveScheduleAirline(
            getScheduleReviewsRequest.scheduleId,
          ),
        );
        airline['airlineServices'] = airlineServices;

        // 리뷰 작성 상태 조회
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
      // 홍화면 일정 조회
      let [homeSchedule] = await queryRunner.query(
        this.scheduleQuery.retrieveHomeSchedule(userId),
      );

      if (homeSchedule) {
        // 출발 공항의 선택된 서비스 조회
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
