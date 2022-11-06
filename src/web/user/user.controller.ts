import { Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BaseResponse } from 'config/base.response';
import { response } from 'config/response.utils';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import {
  DeleteUser,
  GetUser,
  GetUserReviews,
  PatchUser,
  PostUser,
} from '../decorators/user.decorator';
import { GetUserReviewsRequest } from './dto/get-user-reviews.request';
import { GetUserReviewsResponse } from './dto/get-user-reviews.response';
import { GetUserRequest } from './dto/get-user.request';
import { GetUserResponse } from './dto/get-user.response';
import { PatchUserStatusRequest } from './dto/patch-user-status.request';
import { PatchUserRequest } from './dto/patch-user.request';
import { PostUserRequest } from './dto/post-user.request';
import { PostUserResponse } from './dto/post-user.response';
import { UserService } from './user.service';

@ApiTags('User API')
@Controller('/web/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /*
    description: 회원가입 api
    requires: PostUserRequest
    returns: PostUserResponse
  */
  @ApiOperation({ summary: '회원가입 API' })
  @ApiResponse({
    status: 1000,
    description: '성공',
    type: PostUserResponse,
  })
  @ApiResponse({
    status: 2001,
    description: '전화번호를 입력해주세요.',
  })
  @ApiResponse({
    status: 2002,
    description: '전화번호의 형식을 확인해주세요.',
  })
  @ApiResponse({
    status: 2003,
    description: '아이디를 입력해주세요.',
  })
  @ApiResponse({
    status: 2004,
    description: '아이디의 길이를 확인해주세요.',
  })
  @ApiResponse({
    status: 2005,
    description: '비밀번호를 입력해주세요.',
  })
  @ApiResponse({
    status: 2006,
    description: '비밀번호의 형식을 확인해주세요.',
  })
  @ApiResponse({
    status: 2007,
    description: '닉네임을 입력해주세요.',
  })
  @ApiResponse({
    status: 2008,
    description: '닉네임의 형식을 확인해주세요.',
  })
  @ApiResponse({
    status: 2009,
    description: '존재하는 전화번호입니다.',
  })
  @ApiResponse({
    status: 2010,
    description: '존재하는 아이디입니다.',
  })
  @ApiResponse({
    status: 4000,
    description: '서버 에러',
  })
  @ApiBody({
    description: '회원가입 DTO',
    type: PostUserRequest,
  })
  @Post()
  async postUser(@PostUser() postUserRequest: PostUserRequest) {
    return await this.userService.createUser(postUserRequest);
  }

  /*
    description: 유저 정보 수정 api
    requires: PatchUserRequest
    returns: BaseResponse
  */
  @ApiOperation({ summary: '유저 정보 수정 API' })
  @ApiResponse({
    status: 1000,
    description: '성공',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 2007,
    description: '닉네임을 입력해주세요.',
  })
  @ApiResponse({
    status: 2008,
    description: '닉네임의 형식을 확인해주세요.',
  })
  @ApiResponse({
    status: 2014,
    description: '존재하지 않는 유저입니다.',
  })
  @ApiResponse({
    status: 2017,
    description: '유저 아이디를 입력해주세요.',
  })
  @ApiResponse({
    status: 2018,
    description: '유저 아이디는 0보다 큰 값을 입력해주세요.',
  })
  @ApiResponse({
    status: 2033,
    description: '유저 아이디를 확인해주세요.',
  })
  @ApiResponse({
    status: 4000,
    description: '서버 에러',
  })
  @ApiBody({
    description: '유저 정보 수정 DTO',
    type: PatchUserRequest,
  })
  @ApiHeader({
    description: 'jwt token',
    name: 'x-access-token',
    example: 'JWT TOKEN',
    required: true,
  })
  @UseGuards(JwtAuthGuard)
  @Patch()
  async patchUser(
    @Req() req: any,
    @PatchUser() patchUserRequest: PatchUserRequest,
  ) {
    const userIdJwt = req.user.userId;
    if (userIdJwt != patchUserRequest.userId) {
      return response.USER_ERROR_TYPE;
    }

    return await this.userService.editUser(patchUserRequest);
  }

  /*
    description: 회원 탈퇴 api
    requires: PatchUserStatusRequest
    returns: BaseResponse
  */
  @ApiOperation({ summary: '회원 탈퇴 API' })
  @ApiResponse({
    status: 1000,
    description: '성공',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 2014,
    description: '존재하지 않는 유저입니다.',
  })
  @ApiResponse({
    status: 2017,
    description: '유저 아이디를 입력해주세요.',
  })
  @ApiResponse({
    status: 2018,
    description: '유저 아이디는 0보다 큰 값을 입력해주세요.',
  })
  @ApiResponse({
    status: 2033,
    description: '유저 아이디를 확인해주세요.',
  })
  @ApiResponse({
    status: 2064,
    description: '탈퇴 사유 아이디를 입력해주세요.',
  })
  @ApiResponse({
    status: 2065,
    description: '탈퇴 사유 아이디는 0보다 큰 값을 입력해주세요.',
  })
  @ApiResponse({
    status: 4000,
    description: '서버 에러',
  })
  @ApiBody({
    description: '회원 탈퇴 DTO',
    type: PatchUserStatusRequest,
  })
  @ApiHeader({
    description: 'jwt token',
    name: 'x-access-token',
    example: 'JWT TOKEN',
    required: true,
  })
  @UseGuards(JwtAuthGuard)
  @Patch('/status')
  async patchUserStatus(
    @Req() req: any,
    @DeleteUser() patchUserStatusRequest: PatchUserStatusRequest,
  ) {
    const userIdJwt = req.user.userId;
    if (userIdJwt != patchUserStatusRequest.userId) {
      return response.USER_ERROR_TYPE;
    }

    return await this.userService.deleteUser(patchUserStatusRequest);
  }

  /*
    description: 유저 정보 조회 api
    requires: GetUserRequest
    returns: GetUserResponse
  */
  @ApiOperation({ summary: '유저 정보 조회 API' })
  @ApiResponse({
    status: 1000,
    description: '성공',
    type: GetUserResponse,
  })
  @ApiResponse({
    status: 2014,
    description: '존재하지 않는 유저입니다.',
  })
  @ApiResponse({
    status: 2017,
    description: '유저 아이디를 입력해주세요.',
  })
  @ApiResponse({
    status: 2018,
    description: '유저 아이디는 0보다 큰 값을 입력해주세요.',
  })
  @ApiResponse({
    status: 4000,
    description: '서버 에러',
  })
  @ApiParam({
    example: 1,
    description: '유저 아이디',
    name: 'userId',
  })
  @ApiHeader({
    description: 'jwt token',
    name: 'x-access-token',
    example: 'JWT TOKEN',
    required: true,
  })
  @UseGuards(JwtAuthGuard)
  @Get('/:userId')
  async getUser(@GetUser() getUserRequest: GetUserRequest) {
    return await this.userService.retrieveUser(getUserRequest);
  }

  /*
    description: 유저 리뷰 리스트 조회 api
    requires: GetUserReviewsRequest
    returns: GetUserReviewsResponse
  */
  @ApiOperation({ summary: '유저 리뷰 리스트 조회 API' })
  @ApiResponse({
    status: 1000,
    description: '성공',
    type: GetUserReviewsResponse,
  })
  @ApiResponse({
    status: 2014,
    description: '존재하지 않는 유저입니다.',
  })
  @ApiResponse({
    status: 2017,
    description: '유저 아이디를 입력해주세요.',
  })
  @ApiResponse({
    status: 2018,
    description: '유저 아이디는 0보다 큰 값을 입력해주세요.',
  })
  @ApiResponse({
    status: 2033,
    description: '유저 아이디를 확인해주세요.',
  })
  @ApiResponse({
    status: 4000,
    description: '서버 에러',
  })
  @ApiParam({
    example: 1,
    description: '유저 아이디',
    name: 'userId',
  })
  @ApiHeader({
    description: 'jwt token',
    name: 'x-access-token',
    example: 'JWT TOKEN',
    required: true,
  })
  @UseGuards(JwtAuthGuard)
  @Get('/:userId/reviews')
  async getUserReviews(
    @Req() req: any,
    @GetUserReviews() getUserReviewsRequest: GetUserReviewsRequest,
  ) {
    const userIdJwt = req.user.userId;

    if (userIdJwt != getUserReviewsRequest.userId) {
      return response.USER_ERROR_TYPE;
    }

    return await this.userService.retrieveUserReviews(getUserReviewsRequest);
  }
}
