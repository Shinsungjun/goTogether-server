import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseResponse } from 'config/base.response';
import { GetDuplicateId } from '../decorators/auth.decorator';
import { AuthService } from './auth.service';
import { GetDuplicateIdRequest } from './dto/get-duplicate-id.request';

@ApiTags('Auth API')
@Controller('/web/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
}
