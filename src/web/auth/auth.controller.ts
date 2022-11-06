import { Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { makeResponse } from 'common/function.utils';
import { BaseResponse } from 'config/base.response';
import { response } from 'config/response.utils';
import {
  CompareIdPhoneNumber,
  GetPassword,
  GetDuplicateId,
  GetDuplicatePhoneNumber,
  GetId,
  PatchUserPassword,
  SendSMS,
  SignIn,
  VerifySMS,
} from '../decorators/auth.decorator';
import { AuthService } from './auth.service';
import { CheckJwtRepsonse } from './dto/check-jwt.response';
import { CompareIdPhoneNumberRequest } from './dto/compare-id-phoneNumber.request';
import { CompareIdPhoneNumberResponse } from './dto/compare-id-phoneNumber.response';
import { GetPasswordRequest } from './dto/get-password.request';
import { GetDuplicateIdRequest } from './dto/get-duplicate-id.request';
import { GetDuplicatePhoneNumberRequest } from './dto/get-duplicate-phoneNumber.request';
import { GetIdRequest } from './dto/get-id.request';
import { GetIdResponse } from './dto/get-id.response';
import { PatchUserPasswordRequest } from './dto/patch-user-password.request';
import { SendSMSRequest } from './dto/send-SMS.request';
import { SignInRequest } from './dto/sign-in.request';
import { SignInResponse } from './dto/sign-in.response';
import { VerifySMSRequest } from './dto/verify-SMS.request';
import { JwtAuthGuard } from './jwt/jwt.guard';

@ApiTags('Auth API')
@Controller('/web/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /*
    description: 휴대폰 인증 api
    requires: sendSMSRequest
    returns: BaseResponse
  */
  @ApiOperation({ summary: '휴대폰 인증 API' })
  @ApiResponse({
    status: 1000,
    description: '성공',
    type: BaseResponse,
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
    status: 4000,
    description: '서버 에러',
  })
  @ApiBody({
    description: '휴대폰 인증 DTO',
    type: SendSMSRequest,
  })
  @Post('/phone')
  async sendSMS(@SendSMS() sendSMSRequest: SendSMSRequest) {
    return await this.authService.sendSMS(sendSMSRequest);
  }

  /*
    description: 휴대폰 인증 확인 api
    requires: verifySMSRequest
    returns: BaseResponse
  */
  @ApiOperation({ summary: '휴대폰 인증 확인 API' })
  @ApiResponse({
    status: 1000,
    description: '성공',
    type: BaseResponse,
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
    status: 2012,
    description: '인증번호는 6자리로 입력해주세요.',
  })
  @ApiResponse({
    status: 2013,
    description: '인증번호가 일치하지 않습니다.',
  })
  @ApiResponse({
    status: 4000,
    description: '서버 에러',
  })
  @ApiQuery({
    name: 'phoneNumber',
    example: '010-4793-7231',
    description: '전화번호',
  })
  @ApiQuery({
    name: 'verifyCode',
    example: '123456',
    description: '인증번호',
  })
  @Get('/phone/verify')
  async verifySMS(@VerifySMS() verifySMSRequest: VerifySMSRequest) {
    return await this.authService.verifySMS(verifySMSRequest);
  }

  /*
    description: 아이디 중복 확인 api
    requires: GetDuplicateIdRequest
    returns: BaseResponse
  */
  @ApiOperation({ summary: '아이디 중복 확인 API ' })
  @ApiResponse({
    status: 1000,
    description: '성공',
    type: BaseResponse,
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
    status: 2010,
    description: '존재하는 아이디입니다.',
  })
  @ApiResponse({
    status: 4000,
    description: '서버 에러',
  })
  @ApiQuery({
    name: 'userName',
    description: '아이디',
    type: GetDuplicateIdRequest,
  })
  @Get('/duplicate-id')
  async getDuplicateId(
    @GetDuplicateId() getDuplicateIdRequest: GetDuplicateIdRequest,
  ) {
    return await this.authService.retrieveDuplicateId(getDuplicateIdRequest);
  }

  /*
    description: 로그인 api
    requires: signInRequest
    returns: signInResponse
  */
  @ApiOperation({ summary: '로그인 API' })
  @ApiResponse({
    status: 1000,
    description: '성공',
    type: SignInResponse,
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
    status: 2015,
    description: '아이디 혹은 비밀번호가 틀렸습니다.',
  })
  @ApiResponse({
    status: 4000,
    description: '서버 에러',
  })
  @ApiBody({
    description: '로그인 DTO',
    type: SignInRequest,
  })
  @Post('sign-in')
  async signIn(@SignIn() signInRequest: SignInRequest) {
    return await this.authService.signIn(signInRequest);
  }

  /*
    description: 자동 로그인 api
    requires: x
    returns: 
  */
  @ApiOperation({ summary: '자동 로그인 API' })
  @ApiResponse({
    status: 1000,
    description: '성공',
    type: CheckJwtRepsonse,
  })
  @ApiResponse({
    status: 2000,
    description: 'jwt 검증 실패',
  })
  @ApiResponse({
    status: 4000,
    description: '서버 에러',
  })
  @ApiHeader({
    description: 'jwt token',
    name: 'x-access-token',
    example: 'JWT TOKEN',
    required: true,
  })
  @Get('/jwt')
  @UseGuards(JwtAuthGuard)
  async checkJwt(@Req() req: any) {
    try {
      const userInfo = { ...req.user };

      const data = {
        userId: userInfo.userId,
        nickName: userInfo.nickName,
        phoneNumbner: userInfo.phoneNumber,
      };

      return makeResponse(response.SUCCESS, data);
    } catch (error) {
      return response.ERROR;
    }
  }

  /*
    description: 아이디 찾기 api
    requires: GetIdRequest
    returns: GetIdResponse
  */
  @ApiOperation({ summary: '아이디 찾기 API' })
  @ApiResponse({
    status: 1000,
    description: '성공',
    type: GetIdResponse,
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
    status: 2014,
    description: '존재하지 않는 유저입니다.',
  })
  @ApiResponse({
    status: 4000,
    description: '서버 에러',
  })
  @ApiQuery({
    description: '아이디 찾기 DTO',
    type: GetIdRequest,
  })
  @Get('/id')
  async getId(@GetId() getIdRequest: GetIdRequest) {
    return await this.authService.retrieveId(getIdRequest);
  }

  /*
    description: 아이디 전화번호 대조 api
    requires: CompareIdPhoneNumberRequest
    returns: CompareIdPhoneNumberResponse
  */
  @ApiOperation({ summary: '아이디 전화번호 대조 API' })
  @ApiResponse({
    status: 1000,
    description: '성공',
    type: CompareIdPhoneNumberResponse,
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
    status: 2014,
    description: '존재하지 않는 유저입니다.',
  })
  @ApiResponse({
    status: 2016,
    description: '전화번호가 틀렸습니다.',
  })
  @ApiResponse({
    status: 4000,
    description: '서버 에러',
  })
  @ApiQuery({
    description: '아이디 전화번호 대조 DTO',
    type: CompareIdPhoneNumberRequest,
  })
  @Get('/id-phonenumber')
  async compareIdPhoneNumber(
    @CompareIdPhoneNumber()
    compareIdPhoneNumberRequest: CompareIdPhoneNumberRequest,
  ) {
    return await this.authService.compareIdPhoneNumber(
      compareIdPhoneNumberRequest,
    );
  }

  /*
    description: 비밀번호 변경 api
    requires: PatchUserPasswordRequest
    returns: BaseResponse
  */
  @ApiOperation({ summary: '비밀번호 변경 API' })
  @ApiResponse({
    status: 1000,
    description: '성공',
    type: BaseResponse,
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
    status: 2017,
    description: '유저 아이디를 입력해주세요.',
  })
  @ApiResponse({
    status: 2018,
    description: '유저 아이디는 0보다 큰 값을 입력해주세요.',
  })
  @ApiResponse({
    status: 2019,
    description: '기존과 같은 비밀번호입니다.',
  })
  @ApiResponse({
    status: 4000,
    description: '서버 에러',
  })
  @ApiBody({
    description: '비밀번호 변경 DTO',
    type: PatchUserPasswordRequest,
  })
  @Patch('/password')
  async patchUserPassword(
    @PatchUserPassword() patchUserPasswordRequest: PatchUserPasswordRequest,
  ) {
    return await this.authService.editUserPassword(patchUserPasswordRequest);
  }

  /*
  description: 비밀번호 확인 api
  requires: GetAuthPasswordRequest
  returns: BaseResponse
  */
  @ApiOperation({ summary: '비밀번호 확인 api' })
  @ApiResponse({
    status: 1000,
    description: '성공',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 2000,
    description: 'jwt 검증 실패',
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
    status: 2066,
    description: '비밀번호가 틀렸습니다.',
  })
  @ApiResponse({
    status: 4000,
    description: '서버 에러',
  })
  @ApiHeader({
    description: 'jwt token',
    name: 'x-access-token',
    example: 'JWT TOKEN',
    required: true,
  })
  @ApiQuery({
    example: 'hyunbin7231',
    description: '비밀번호',
    type: GetPasswordRequest,
  })
  @UseGuards(JwtAuthGuard)
  @Get('/password')
  async getPassword(
    @Req() req: any,
    @GetPassword() getPasswordRequest: GetPasswordRequest,
  ) {
    const userId = req.user.userId;

    return await this.authService.retrievePassword(userId, getPasswordRequest);
  }

  /*
    description: 전화번호 중복 확인 api
    requires: GetDuplicatePhoneNumberRequest
    returns: BaseResponse
  */
  @ApiOperation({ summary: '전화번호 중복 확인 API' })
  @ApiResponse({
    status: 1000,
    description: '성공',
    type: BaseResponse,
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
    status: 2009,
    description: '존재하는 전화번호입니다.',
  })
  @ApiResponse({
    status: 4000,
    description: '서버 에러',
  })
  @ApiQuery({
    name: 'phoneNumber',
    description: '전화번호',
    type: GetDuplicatePhoneNumberRequest,
  })
  @Get('/duplicate-phonenumber')
  async getDuplicatePhoneNumber(
    @GetDuplicatePhoneNumber()
    getDuplicatePhoneNumberRequest: GetDuplicatePhoneNumberRequest,
  ) {
    return await this.authService.retrieveDuplicatePhoneNumber(
      getDuplicatePhoneNumberRequest,
    );
  }
}
