import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { makeResponse } from 'common/function.utils';
import { Status } from 'common/variable.utils';
import { response } from 'config/response.utils';
import { ReviewReportReason } from 'src/entity/reviewReportReason.entity';
import { UserDeleteReason } from 'src/entity/userDeleteReason.entity';
import { Repository } from 'typeorm';

@Injectable()
export class InfoService {
  constructor(
    @InjectRepository(UserDeleteReason)
    private readonly userDeleteReasonRepository: Repository<UserDeleteReason>,

    @InjectRepository(ReviewReportReason)
    private readonly reviewReportReasonRepository: Repository<ReviewReportReason>,
  ) {}

  // 탈퇴 사유 리스트 조회
  async retrieveUserDeleteReasons() {
    try {
      const userDeleteReasons = await this.userDeleteReasonRepository.find({
        select: ['id', 'name'],
        where: {
          status: Status.ACTIVE,
        },
      });

      const data = {
        userDeleteReasons: userDeleteReasons,
      };

      const result = makeResponse(response.SUCCESS, data);

      return result;
    } catch (error) {
      return response.ERROR;
    }
  }

  // 리뷰 신고 사유 리스트 조회
  async retrieveReviewReportReasons() {
    try {
      const reviewReportReasons = await this.reviewReportReasonRepository.find({
        select: ['id', 'name'],
        where: {
          status: Status.ACTIVE,
        },
      });

      const data = {
        reviewReportReasons: reviewReportReasons,
      };

      const result = makeResponse(response.SUCCESS, data);

      return result;
    } catch (error) {
      return response.ERROR;
    }
  }
}
