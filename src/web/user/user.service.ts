import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Status } from 'common/variable.utils';
import { response } from 'config/response.utils';
import { User } from 'src/entity/user.entity';
import { DataSource, Repository } from 'typeorm';
import { PostUserRequest } from './dto/post-user.request';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { makeResponse } from 'common/function.utils';
import { Payload } from '../auth/jwt/jwt.payload';
import { PatchUserRequest } from './dto/patch-user.request';
import { PatchUserStatusRequest } from './dto/patch-user-status.request';
import { GetUserRequest } from './dto/get-user.request';
import { GetUserReviewsRequest } from './dto/get-user-reviews.request';
import { UserQuery } from './user.query';
import { AirlineQuery } from '../airline/airline.query';
import { AirportQuery } from '../airport/airport.query';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
    private connection: DataSource,
    private userQuery: UserQuery,
    private airlineQuery: AirlineQuery,
    private airportQuery: AirportQuery,
  ) {}

  // 회원가입
  async createUser(postUserRequest: PostUserRequest) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    try {
      // 가입된 전화번호인지 확인
      const isExistUserByPhoneNumber = await this.userRepository.findOne({
        where: {
          phoneNumber: postUserRequest.phoneNumber,
          accountStatus: Status.ACTIVE,
          status: Status.ACTIVE,
        },
      });
      if (isExistUserByPhoneNumber) {
        return response.EXIST_PHONENUMBER;
      }

      // 가입된 아이디인지 확인
      const isExistUserByUserName = await this.userRepository.findOne({
        where: {
          userName: postUserRequest.userName,
          accountStatus: Status.ACTIVE,
          status: Status.ACTIVE,
        },
      });
      if (isExistUserByUserName) {
        return response.EXIST_USERNAME;
      }

      // 탈퇴 후 7일이 지나지 않은 계정 존재 확인
      const isExistUserDeleted = await queryRunner.query(
        this.userQuery.retrieveDeletedUserByPhoneNumber(
          postUserRequest.phoneNumber,
        ),
      );
      if (isExistUserDeleted.length > 0) {
        return response.USER_DELETE_DATE_ERROR;
      }

      // 비밀번호 암호화
      const salt = await bcrypt.genSalt(10);
      const hashedPassword: string = await bcrypt.hash(
        postUserRequest.password,
        salt,
      );

      // create user
      let userRegister = new User();
      userRegister.phoneNumber = postUserRequest.phoneNumber;
      userRegister.userName = postUserRequest.userName;
      userRegister.password = hashedPassword;
      userRegister.nickName = postUserRequest.nickName;
      const createUserData = await this.userRepository.save(userRegister);

      // create payload
      const payload: Payload = {
        userId: createUserData.id,
        nickName: createUserData.nickName,
        phoneNumber: createUserData.phoneNumber,
        userName: createUserData.userName,
      };

      const token = this.jwtService.sign(payload);

      const data = {
        createUserId: createUserData.id,
        nickName: createUserData.nickName,
        phoneNumber: createUserData.phoneNumber,
        userName: createUserData.userName,
        jwt: token,
      };

      const result = makeResponse(response.SUCCESS, data);

      return result;
    } catch (error) {
      return response.ERROR;
    } finally {
      await queryRunner.release();
    }
  }

  // 유저 정보 수정
  async editUser(patchUserRequest: PatchUserRequest) {
    try {
      // 존재하는 유저인지 확인
      let user = await this.userRepository.findOneBy({
        id: patchUserRequest.userId,
        accountStatus: Status.ACTIVE,
        status: Status.ACTIVE,
      });
      if (!user) {
        return response.NON_EXIST_USER;
      }

      // update user
      await this.userRepository.update(
        {
          id: patchUserRequest.userId,
        },
        {
          nickName: patchUserRequest.nickName,
        },
      );

      const result = makeResponse(response.SUCCESS, undefined);

      return result;
    } catch (error) {
      return response.ERROR;
    }
  }

  // 유저 삭제
  async deleteUser(patchUserStatusRequest: PatchUserStatusRequest) {
    try {
      // 존재하는 유저인지 확인
      let user = await this.userRepository.findOneBy({
        id: patchUserStatusRequest.userId,
        accountStatus: Status.ACTIVE,
        status: Status.ACTIVE,
      });
      if (!user) {
        return response.NON_EXIST_USER;
      }

      // update user status
      await this.userRepository.update(
        {
          id: patchUserStatusRequest.userId,
        },
        {
          userDeleteReasonId: patchUserStatusRequest.userDeleteReasonId,
          accountStatus: Status.DELETED,
          status: Status.DELETED,
        },
      );

      const result = makeResponse(response.SUCCESS, undefined);

      return result;
    } catch (error) {
      return response.ERROR;
    }
  }

  // 유저 정보 조회
  async retrieveUser(getUserRequest: GetUserRequest) {
    try {
      // 존재하는 유저인지 확인
      const user = await this.userRepository.findOneBy({
        id: getUserRequest.userId,
        status: Status.ACTIVE,
      });
      if (!user) {
        return response.NON_EXIST_USER;
      }
      const data = {
        user: {
          userId: user.id,
          nickName: user.nickName,
          userName: user.userName,
        },
      };

      const result = makeResponse(response.SUCCESS, data);

      return result;
    } catch (error) {
      return response.ERROR;
    }
  }

  // 유저 리뷰 리스트 조회
  async retrieveUserReviews(getUserReviewsRequest: GetUserReviewsRequest) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    try {
      // 공항 리뷰 리스트 조회
      let airportReviews = await queryRunner.query(
        this.userQuery.retrieveUserAirportReviewsQuery(
          getUserReviewsRequest.userId,
        ),
      );
      // 공항 리뷰 서비스 리스트 조회
      for (let airportReview of airportReviews) {
        const airportReviewedServices = await queryRunner.query(
          this.airportQuery.retrieveAirportReviewedServicesQuery(
            airportReview.id,
          ),
        );
        airportReview['reviewedAirportServices'] = airportReviewedServices.map(
          (x) => x.name,
        );
        airportReview['type'] = 'AIRPORT';
      }

      // 항공사 리뷰 리스트 조회
      let airlineReviews = await queryRunner.query(
        this.userQuery.retrieveUserAirlineReviewsQuery(
          getUserReviewsRequest.userId,
        ),
      );
      // 항공사 리뷰 서비스 리스트 조회
      for (let airlineReview of airlineReviews) {
        const airlineReviewedServices = await queryRunner.query(
          this.airlineQuery.retrieveAirlineReviewedServicesQuery(
            airlineReview.id,
          ),
        );
        airlineReview['reviewedAirlineServices'] = airlineReviewedServices.map(
          (x) => x.name,
        );
        airlineReview['type'] = 'AIRLINE';
      }

      let userReviews = [...airportReviews, ...airlineReviews];

      // 생성일시로 정렬
      userReviews.sort(function (a, b) {
        if (a.createdAt < b.createdAt) {
          return 1;
        }
        if (a.createdAt > b.createdAt) {
          return -1;
        }
        return 0;
      });

      const data = {
        userReviews: userReviews,
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
