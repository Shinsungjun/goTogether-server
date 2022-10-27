import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { makeResponse } from 'common/function.utils';
import { Status } from 'common/variable.utils';
import { response } from 'config/response.utils';
import { Airline } from 'src/entity/airline.entity';
import { DataSource, Repository } from 'typeorm';
import { GetAirlineServicesRequest } from './dto/get-airline-services.request';
import { AirlineService as AirlineServiceEntity } from 'src/entity/airlineService.entity';
import { GetAirlineRequest } from './dto/get-airline.request';
import { AirlineQuery } from './airline.query';
import { GetAirlineReviewsRequest } from './dto/get-airline-reviews.request';

@Injectable()
export class AirlineService {
  constructor(
    @InjectRepository(Airline)
    private airlineRepository: Repository<Airline>,
    @InjectRepository(AirlineServiceEntity)
    private airlineServiceRepository: Repository<AirlineServiceEntity>,

    private airlineQuery: AirlineQuery,
    private connection: DataSource,
  ) {}

  async retrieveAirlines() {
    try {
      const airlines = await this.airlineRepository.find({
        select: ['id', 'name', 'logoImageUrl'],
        where: {
          status: Status.ACTIVE,
        },
      });

      const data = {
        airlines: airlines,
      };

      const result = makeResponse(response.SUCCESS, data);

      return result;
    } catch (error) {
      return response.ERROR;
    }
  }

  async retrieveAirlineServices(
    getAirlineServicesRequest: GetAirlineServicesRequest,
  ) {
    try {
      const airlineServices = await this.airlineServiceRepository.find({
        select: ['id', 'name'],
        where: {
          airlineId: getAirlineServicesRequest.airlineId,
          status: Status.ACTIVE,
        },
      });
      const data = {
        airlineServices: airlineServices,
      };
      const result = makeResponse(response.SUCCESS, data);

      return result;
    } catch (error) {
      return response.ERROR;
    }
  }

  async retrieveAirline(getAirlineRequest: GetAirlineRequest) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    try {
      // 존재하는 항공사인지 확인
      if (
        !(await this.airlineRepository.findOneBy({
          id: getAirlineRequest.airlineId,
          status: Status.ACTIVE,
        }))
      ) {
        return response.NON_EXIST_AIRLINE;
      }

      // 항공사 정보 조회
      let [airline] = await queryRunner.query(
        this.airlineQuery.retrieveAirlineQuery(getAirlineRequest.airlineId),
      );

      // 항공사 서비스 조회
      const airlineServices = await this.airlineServiceRepository.find({
        select: ['id', 'name'],
        where: {
          airlineId: getAirlineRequest.airlineId,
          status: Status.ACTIVE,
        },
      });
      airline['airlineServices'] = airlineServices;

      const data = {
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

  async retrieveAirlineReviews(
    getAirlineReviewsRequest: GetAirlineReviewsRequest,
  ) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    try {
      // 존재하는 공항인지 확인
      if (
        !(await this.airlineRepository.findOneBy({
          id: getAirlineReviewsRequest.airlineId,
          status: Status.ACTIVE,
        }))
      ) {
        return response.NON_EXIST_AIRLINE;
      }

      // 필터링 쿼리
      let filterQuery: string = ``;
      if (getAirlineReviewsRequest.airlineServiceId) {
        if (typeof getAirlineReviewsRequest.airlineServiceId == 'string') {
          // filter 한 개만 존재
          filterQuery = `AND airlineServiceId = ${getAirlineReviewsRequest.airlineServiceId}`;
        } else {
          for (const airlineServiceId of getAirlineReviewsRequest.airlineServiceId) {
            filterQuery =
              filterQuery + `and AirlineService.id = ${airlineServiceId} `;
          }
        }
      }

      // 페이징
      const pageSize = 5;
      const offset: number = pageSize * (getAirlineReviewsRequest.page - 1);
      const total = await queryRunner.query(
        this.airlineQuery.retrieveTotalAirlineReviewsQuery(
          getAirlineReviewsRequest.airlineId,
          filterQuery,
        ),
      );

      // 존재하는 페이지인지 검증
      if (getAirlineReviewsRequest.page > Math.ceil(total.length / pageSize)) {
        return response.NON_EXIST_PAGE;
      }

      let airlineReviews = await queryRunner.query(
        this.airlineQuery.retrieveAirlineReviewsQuery(
          getAirlineReviewsRequest.airlineId,
          offset,
          pageSize,
          filterQuery,
        ),
      );

      for (let airlineReview of airlineReviews) {
        const airlineReviewedServices = await queryRunner.query(
          this.airlineQuery.retrieveAirlineReviewedServices(
            airlineReview.airlineReviewId,
          ),
        );
        airlineReview['reviewedAirlineServices'] = airlineReviewedServices.map(
          (x) => x.name,
        );
      }

      const data = {
        total: total.length,
        airlineReview: airlineReviews,
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
