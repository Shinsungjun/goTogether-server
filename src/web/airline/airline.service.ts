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
import { PostAirlineReviewRequest } from './dto/post-airline-review.request';
import { AuthService } from '../auth/auth.service';
import { AirlineReview } from 'src/entity/airlineReview.entity';
import { ReviewAirlineService } from 'src/entity/reviewAirlineService.entity';
import { Schedule } from 'src/entity/schedule.entity';
import { PatchAirlineReviewRequest } from './dto/patch-airline-review.request';
import { DeleteAirlineReviewRequest } from './dto/delete-airline-review.request';
import { PostAirlineReviewReportRequest } from './dto/post-airline-review-report.request';

@Injectable()
export class AirlineService {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(Airline)
    private airlineRepository: Repository<Airline>,
    @InjectRepository(AirlineServiceEntity)
    private airlineServiceRepository: Repository<AirlineServiceEntity>,
    @InjectRepository(AirlineReview)
    private airlineReviewRepository: Repository<AirlineReview>,
    @InjectRepository(ReviewAirlineService)
    private reviewAirlineServiceRepository: Repository<ReviewAirlineService>,

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
      // 존재하는 항공사인지 확인
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
          this.airlineQuery.retrieveAirlineReviewedServicesQuery(
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

  async createAirlineReview(
    postAirlineReviewRequest: PostAirlineReviewRequest,
  ) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // 존재하는 유저인지 확인
      if (
        !(await this.authService.isExistUser(postAirlineReviewRequest.userId))
      ) {
        return response.NON_EXIST_USER;
      }

      // 존재하는 항공사인지 확인
      if (
        !(await this.airlineRepository.findOneBy({
          id: postAirlineReviewRequest.airlineId,
          status: Status.ACTIVE,
        }))
      ) {
        return response.NON_EXIST_AIRLINE;
      }

      // 리뷰 생성
      let airlineReviewRegister = new AirlineReview();
      airlineReviewRegister.userId = postAirlineReviewRequest.userId;
      airlineReviewRegister.airlineId = postAirlineReviewRequest.airlineId;
      airlineReviewRegister.content = postAirlineReviewRequest.content;
      airlineReviewRegister.score = postAirlineReviewRequest.score;
      // 존재하는 일정인지 확인
      if (postAirlineReviewRequest.scheduleId) {
        let schedule = await queryRunner.manager.findOneBy(Schedule, {
          id: postAirlineReviewRequest.scheduleId,
          status: Status.ACTIVE,
        });
        if (!schedule) {
          return response.NON_EXIST_SCHEDULE;
        }

        // 해당 user의 일정인지 확인
        if (schedule.userId != postAirlineReviewRequest.userId) {
          return response.SCHEDULE_USER_PERMISSION_DENIED;
        }

        airlineReviewRegister.scheduleId = postAirlineReviewRequest.scheduleId;
      }

      const createdAirlineReview = await queryRunner.manager.save(
        airlineReviewRegister,
      );

      // 항공사 서비스 리뷰 생성
      for (const airlineServiceId of postAirlineReviewRequest.airlineServiceIds) {
        // 존재하는 서비스인지 확인
        if (
          !(await this.airlineServiceRepository.findOneBy({
            id: airlineServiceId,
            airlineId: postAirlineReviewRequest.airlineId,
            status: Status.ACTIVE,
          }))
        ) {
          return response.NON_EXIST_AIRLINE_SERVICE;
        }
        let reviewAirlineServiceRegister = new ReviewAirlineService();
        reviewAirlineServiceRegister.airlineReviewId = createdAirlineReview.id;
        reviewAirlineServiceRegister.airlineServiceId = airlineServiceId;

        await queryRunner.manager.save(reviewAirlineServiceRegister);
      }

      const data = {
        createdReviewId: createdAirlineReview.id,
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

  async editAirlineReview(
    userId: number,
    patchAirlineReviewRequest: PatchAirlineReviewRequest,
  ) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    try {
      // 존재하는 리뷰인지 확인
      const airlineReview = await this.airlineReviewRepository.findOneBy({
        id: patchAirlineReviewRequest.airlineReviewId,
        status: Status.ACTIVE,
      });
      if (!airlineReview) {
        return response.NON_EXIST_AIRLINE_REVIEW;
      }

      // 본인의 리뷰인지 확인
      if (airlineReview.userId != userId) {
        return response.REVIEW_USER_PERMISSION_DENIED;
      }

      // 작성한지 48시간 이내인지 확인
      const [reviewTime] = await queryRunner.query(
        this.airlineQuery.retrieveAirlineReviewTimeQuery(
          patchAirlineReviewRequest.airlineReviewId,
        ),
      );
      if (!reviewTime) {
        return response.REVIEW_EDIT_TIME_ERROR;
      }

      await this.airlineReviewRepository.update(
        {
          id: patchAirlineReviewRequest.airlineReviewId,
        },
        {
          content: patchAirlineReviewRequest.content,
        },
      );

      const result = makeResponse(response.SUCCESS, undefined);

      return result;
    } catch (error) {
      return response.ERROR;
    } finally {
      await queryRunner.release();
    }
  }

  async deleteAirlineReview(
    userId: number,
    deleteAirlineReviewRequest: DeleteAirlineReviewRequest,
  ) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // 존재하는 리뷰인지 확인
      const airlineReview = await this.airlineReviewRepository.findOneBy({
        id: deleteAirlineReviewRequest.airlineReviewId,
        status: Status.ACTIVE,
      });
      if (!airlineReview) {
        return response.NON_EXIST_AIRLINE_REVIEW;
      }

      // 본인의 리뷰인지 확인
      if (airlineReview.userId != userId) {
        return response.REVIEW_USER_PERMISSION_DENIED;
      }

      // 작성한지 30일 이후인지 확인
      const [reviewTime] = await queryRunner.query(
        this.airlineQuery.retrieveAirlineReviewDeleteTimeQuery(
          deleteAirlineReviewRequest.airlineReviewId,
        ),
      );
      if (!reviewTime) {
        return response.REVIEW_DELETE_TIME_ERROR;
      }

      await queryRunner.manager.update(
        AirlineReview,
        {
          id: deleteAirlineReviewRequest.airlineReviewId,
        },
        {
          status: Status.DELETED,
        },
      );

      await queryRunner.manager.update(
        ReviewAirlineService,
        {
          airlineReviewId: deleteAirlineReviewRequest.airlineReviewId,
        },
        {
          status: Status.DELETED,
        },
      );

      const result = makeResponse(response.SUCCESS, undefined);

      await queryRunner.commitTransaction();

      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async createAirlineReviewReport(
    userId: number,
    postAirlineReviewReportRequest: PostAirlineReviewReportRequest,
  ) {
    try {
      // 존재하는 리뷰인지 확인
      const airlineReview = await this.airlineReviewRepository.findOneBy({
        id: postAirlineReviewReportRequest.airlineReviewId,
        status: Status.ACTIVE,
      });
      if (!airlineReview) {
        return response.NON_EXIST_AIRLINE_REVIEW;
      }
    } catch (error) {}
  }
}
