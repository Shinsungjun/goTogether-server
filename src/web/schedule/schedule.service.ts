import { Injectable } from '@nestjs/common';
import { response } from 'config/response.utils';
import { PostScheduleRequest } from './dto/post-schedule.request';
import { AuthService } from '../auth/auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Airport } from 'src/entity/airport.entity';
import { DataSource, Repository } from 'typeorm';
import { Airline } from 'src/entity/airline.entity';
import { AirportServiceType, Status } from 'common/variable.utils';
import { AirportService } from 'src/entity/airportSerivce.entity';
import { AirlineService } from 'src/entity/airlineService.entity';
import { ScheduleAirlineService } from 'src/entity/scheduleAirlineService.entity';
import { ScheduleAirportService } from 'src/entity/scheduleAirportService.entity';
import { Schedule } from 'src/entity/schedule.entity';
import { makeResponse } from 'common/function.utils';

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
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,

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
}
