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
import { AirlineReviewReport } from 'src/entity/airlineReviewReport.entity';
import { ReviewReportReason } from 'src/entity/reviewReportReason.entity';

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
    @InjectRepository(AirlineReviewReport)
    private airlineReviewReportRepository: Repository<AirlineReviewReport>,
    @InjectRepository(ReviewReportReason)
    private reviewReportReasonRepository: Repository<ReviewReportReason>,

    private airlineQuery: AirlineQuery,
    private connection: DataSource,
  ) {}

  // ????????? ????????? ??????
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

  // ????????? ????????? ????????? ??????
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

  // ????????? ?????? ??????
  async retrieveAirline(getAirlineRequest: GetAirlineRequest) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    try {
      // ???????????? ??????????????? ??????
      if (
        !(await this.airlineRepository.findOneBy({
          id: getAirlineRequest.airlineId,
          status: Status.ACTIVE,
        }))
      ) {
        return response.NON_EXIST_AIRLINE;
      }

      // ????????? ?????? ??????
      let [airline] = await queryRunner.query(
        this.airlineQuery.retrieveAirlineQuery(getAirlineRequest.airlineId),
      );

      // ????????? ????????? ????????? ??????
      const airlineServices = await this.airlineServiceRepository.find({
        select: ['id', 'name', 'website'],
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

  // ????????? ?????? ????????? ??????
  async retrieveAirlineReviews(
    getAirlineReviewsRequest: GetAirlineReviewsRequest,
  ) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    try {
      // ???????????? ??????????????? ??????
      if (
        !(await this.airlineRepository.findOneBy({
          id: getAirlineReviewsRequest.airlineId,
          status: Status.ACTIVE,
        }))
      ) {
        return response.NON_EXIST_AIRLINE;
      }

      // ????????? ??????
      let filterQuery: string = ``;
      if (getAirlineReviewsRequest.airlineServiceId) {
        if (typeof getAirlineReviewsRequest.airlineServiceId == 'string') {
          // filter ??? ?????? ??????
          filterQuery = `AND airlineServiceId = ${getAirlineReviewsRequest.airlineServiceId}`;
        } else {
          for (const airlineServiceId of getAirlineReviewsRequest.airlineServiceId) {
            filterQuery =
              filterQuery + `and AirlineService.id = ${airlineServiceId} `;
          }
        }
      }

      // ?????????
      const pageSize = 10;
      const offset: number = pageSize * (getAirlineReviewsRequest.page - 1);
      const total = await queryRunner.query(
        this.airlineQuery.retrieveTotalAirlineReviewsQuery(
          getAirlineReviewsRequest.airlineId,
          filterQuery,
        ),
      );

      // ???????????? ??????????????? ??????
      if (getAirlineReviewsRequest.page > Math.ceil(total.length / pageSize)) {
        return response.NON_EXIST_PAGE;
      }

      // ????????? ?????? ????????? ??????
      let airlineReviews = await queryRunner.query(
        this.airlineQuery.retrieveAirlineReviewsQuery(
          getAirlineReviewsRequest.airlineId,
          offset,
          pageSize,
          filterQuery,
        ),
      );

      // ????????? ????????? ????????? ??????
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

  // ????????? ?????? ??????
  async createAirlineReview(
    postAirlineReviewRequest: PostAirlineReviewRequest,
  ) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // ???????????? ???????????? ??????
      if (
        !(await this.authService.isExistUser(postAirlineReviewRequest.userId))
      ) {
        return response.NON_EXIST_USER;
      }

      // ???????????? ??????????????? ??????
      if (
        !(await this.airlineRepository.findOneBy({
          id: postAirlineReviewRequest.airlineId,
          status: Status.ACTIVE,
        }))
      ) {
        return response.NON_EXIST_AIRLINE;
      }

      // ???????????? ???????????? ??????
      let schedule = await queryRunner.manager.findOneBy(Schedule, {
        id: postAirlineReviewRequest.scheduleId,
        status: Status.ACTIVE,
      });
      if (!schedule) {
        return response.NON_EXIST_SCHEDULE;
      }

      // ?????? user??? ???????????? ??????
      if (schedule.userId != postAirlineReviewRequest.userId) {
        return response.SCHEDULE_USER_PERMISSION_DENIED;
      }

      // ?????? ??????
      let airlineReviewRegister = new AirlineReview();
      airlineReviewRegister.userId = postAirlineReviewRequest.userId;
      airlineReviewRegister.airlineId = postAirlineReviewRequest.airlineId;
      airlineReviewRegister.content = postAirlineReviewRequest.content;
      airlineReviewRegister.score = postAirlineReviewRequest.score;
      airlineReviewRegister.scheduleId = postAirlineReviewRequest.scheduleId;

      const createdAirlineReview = await queryRunner.manager.save(
        airlineReviewRegister,
      );

      // ????????? ????????? ?????? ??????
      for (const airlineServiceId of postAirlineReviewRequest.airlineServiceIds) {
        // ???????????? ??????????????? ??????
        if (
          !(await this.airlineServiceRepository.findOneBy({
            id: airlineServiceId,
            airlineId: postAirlineReviewRequest.airlineId,
            status: Status.ACTIVE,
          }))
        ) {
          await queryRunner.rollbackTransaction();
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

  // ????????? ?????? ??????
  async editAirlineReview(
    userId: number,
    patchAirlineReviewRequest: PatchAirlineReviewRequest,
  ) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    try {
      // ???????????? ???????????? ??????
      const airlineReview = await this.airlineReviewRepository.findOneBy({
        id: patchAirlineReviewRequest.airlineReviewId,
        status: Status.ACTIVE,
      });
      if (!airlineReview) {
        return response.NON_EXIST_AIRLINE_REVIEW;
      }

      // ????????? ???????????? ??????
      if (airlineReview.userId != userId) {
        return response.REVIEW_USER_PERMISSION_DENIED;
      }

      // ???????????? 48?????? ???????????? ??????
      const [reviewTime] = await queryRunner.query(
        this.airlineQuery.retrieveAirlineReviewTimeQuery(
          patchAirlineReviewRequest.airlineReviewId,
        ),
      );
      if (!reviewTime) {
        return response.REVIEW_EDIT_TIME_ERROR;
      }

      // update airline review
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

  // ????????? ?????? ??????
  async deleteAirlineReview(
    userId: number,
    deleteAirlineReviewRequest: DeleteAirlineReviewRequest,
  ) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // ???????????? ???????????? ??????
      const airlineReview = await this.airlineReviewRepository.findOneBy({
        id: deleteAirlineReviewRequest.airlineReviewId,
        status: Status.ACTIVE,
      });
      if (!airlineReview) {
        return response.NON_EXIST_AIRLINE_REVIEW;
      }

      // ????????? ???????????? ??????
      if (airlineReview.userId != userId) {
        return response.REVIEW_USER_PERMISSION_DENIED;
      }

      // ???????????? 30??? ???????????? ??????
      const [reviewTime] = await queryRunner.query(
        this.airlineQuery.retrieveAirlineReviewDeleteTimeQuery(
          deleteAirlineReviewRequest.airlineReviewId,
        ),
      );
      if (!reviewTime) {
        return response.REVIEW_DELETE_TIME_ERROR;
      }

      // update airline review status
      await queryRunner.manager.update(
        AirlineReview,
        {
          id: deleteAirlineReviewRequest.airlineReviewId,
        },
        {
          status: Status.DELETED,
        },
      );

      // updaet airline review service status
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

  // ????????? ?????? ??????
  async createAirlineReviewReport(
    userId: number,
    postAirlineReviewReportRequest: PostAirlineReviewReportRequest,
  ) {
    try {
      // ???????????? ???????????? ??????
      const airlineReview = await this.airlineReviewRepository.findOneBy({
        id: postAirlineReviewReportRequest.airlineReviewId,
        status: Status.ACTIVE,
      });
      if (!airlineReview) {
        return response.NON_EXIST_AIRLINE_REVIEW;
      }

      // ???????????? ?????? ?????? ???????????? ??????
      if (
        !(await this.reviewReportReasonRepository.findOneBy({
          id: postAirlineReviewReportRequest.reviewReportReasonId,
          status: Status.ACTIVE,
        }))
      ) {
        return response.NON_EXIST_REVIEW_REPORT_REASON;
      }

      // ?????? ?????? ??????
      let airlineReviewReportRegister = new AirlineReviewReport();
      airlineReviewReportRegister.userId = userId;
      airlineReviewReportRegister.airlineReviewId =
        postAirlineReviewReportRequest.airlineReviewId;
      airlineReviewReportRegister.reviewReportReasonId =
        postAirlineReviewReportRequest.reviewReportReasonId;
      if (postAirlineReviewReportRequest.etcReason) {
        airlineReviewReportRegister.etcReason =
          postAirlineReviewReportRequest.etcReason;
      }
      await this.airlineReviewReportRepository.save(
        airlineReviewReportRegister,
      );

      const result = makeResponse(response.SUCCESS, undefined);

      return result;
    } catch (error) {
      return response.ERROR;
    }
  }
}
