import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { makeResponse } from 'common/function.utils';
import { Status } from 'common/variable.utils';
import { response } from 'config/response.utils';
import { Airport } from 'src/entity/airport.entity';
import { DataSource, Repository } from 'typeorm';
import { GetAirportServicesRequest } from './dto/get-airport-services.request';
import { AirportService as AirportServiceEntity } from 'src/entity/airportSerivce.entity';
import { GetAirportRequest } from './dto/get-airport.request';
import { AirportQuery } from './airport.query';
import { GetAirportReviewsRequest } from './dto/get-airport-reviews.request';

@Injectable()
export class AirportService {
  constructor(
    @InjectRepository(Airport)
    private airportRepository: Repository<Airport>,
    @InjectRepository(AirportServiceEntity)
    private airportServiceRepository: Repository<AirportServiceEntity>,

    private airportQuery: AirportQuery,
    private connection: DataSource,
  ) {}

  async retrieveAirports() {
    try {
      const airports = await this.airportRepository.find({
        select: ['id', 'name', 'region'],
        where: {
          status: Status.ACTIVE,
        },
      });

      const data = {
        airports: airports,
      };

      const result = makeResponse(response.SUCCESS, data);

      return result;
    } catch (error) {
      return response.ERROR;
    }
  }

  async retrieveAirportServices(
    getAirportServicesRequest: GetAirportServicesRequest,
  ) {
    try {
      // 존재하는 공항인지 확인
      if (
        !(await this.airportRepository.findOneBy({
          id: getAirportServicesRequest.airportId,
          status: Status.ACTIVE,
        }))
      ) {
        return response.NON_EXIST_AIRPORT;
      }

      const airportServices = await this.airportServiceRepository.find({
        select: ['id', 'name'],
        where: {
          airportId: getAirportServicesRequest.airportId,
          status: Status.ACTIVE,
        },
      });

      const data = {
        airportServices: airportServices,
      };
      const result = makeResponse(response.SUCCESS, data);

      return result;
    } catch (error) {
      return response.ERROR;
    }
  }

  async retrieveAirport(getAirportRequest: GetAirportRequest) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    try {
      // 존재하는 공항인지 확인
      if (
        !(await this.airportRepository.findOneBy({
          id: getAirportRequest.airportId,
          status: Status.ACTIVE,
        }))
      ) {
        return response.NON_EXIST_AIRPORT;
      }

      // 공항 정보 조회
      let [airport] = await queryRunner.query(
        this.airportQuery.retrieveAirportQuery(getAirportRequest.airportId),
      );

      // 공항 서비스 조회
      const airportServices = await this.airportServiceRepository.find({
        select: ['id', 'name'],
        where: {
          airportId: getAirportRequest.airportId,
          status: Status.ACTIVE,
        },
      });
      airport['airportServices'] = airportServices;

      const data = {
        airport: airport,
      };

      const result = makeResponse(response.SUCCESS, data);

      return result;
    } catch (error) {
      return response.ERROR;
    } finally {
      await queryRunner.release();
    }
  }

  async retrieveAirportReviews(
    getAirportReviewsRequest: GetAirportReviewsRequest,
  ) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    try {
      // 존재하는 공항인지 확인
      if (
        !(await this.airportRepository.findOneBy({
          id: getAirportReviewsRequest.airportId,
          status: Status.ACTIVE,
        }))
      ) {
        return response.NON_EXIST_AIRPORT;
      }

      // 필터링 쿼리
      let filterQuery: string = ``;
      if (getAirportReviewsRequest.airportServiceId) {
        if (typeof getAirportReviewsRequest.airportServiceId == 'string') {
          // filter 한 개만 존재
          filterQuery = `AND airportServiceId = ${getAirportReviewsRequest.airportServiceId}`;
        } else {
          for (const airportServiceId of getAirportReviewsRequest.airportServiceId) {
            filterQuery =
              filterQuery + `and AirportService.id = ${airportServiceId} `;
          }
        }
      }

      // 페이징
      const pageSize = 5;
      const offset: number = pageSize * (getAirportReviewsRequest.page - 1);
      const total = await queryRunner.query(
        this.airportQuery.retrieveTotalAirportReviewsQuery(
          getAirportReviewsRequest.airportId,
          filterQuery,
        ),
      );

      // 존재하는 페이지인지 검증
      if (getAirportReviewsRequest.page > Math.ceil(total.length / pageSize)) {
        return response.NON_EXIST_PAGE;
      }

      let airportReviews = await queryRunner.query(
        this.airportQuery.retrieveAirportReviewsQuery(
          getAirportReviewsRequest.airportId,
          offset,
          pageSize,
          filterQuery,
        ),
      );

      for (let airportReview of airportReviews) {
        const airportReviewedServices = await queryRunner.query(
          this.airportQuery.retrieveAirportReviewedServices(
            airportReview.airportReviewId,
          ),
        );
        airportReview['reviewedAirportServices'] = airportReviewedServices.map(
          (x) => x.name,
        );
      }

      const data = {
        total: total.length,
        airportReviews: airportReviews,
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
