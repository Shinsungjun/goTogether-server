import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
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
  GetDuplicateId,
  SendSMS,
  SignIn,
  VerifySMS,
} from '../decorators/auth.decorator';
import { AuthService } from './auth.service';
import { CheckJwtRepsonse } from './dto/check-jwt.response';
import { GetDuplicateIdRequest } from './dto/get-duplicate-id.request';
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
      const userIdFromJwt = req.user.userId;

      const data = {
        userId: userIdFromJwt,
      };

      return makeResponse(response.SUCCESS, data);
    } catch (error) {
      return response.ERROR;
    }
  }
}
