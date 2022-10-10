import { Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PostUser } from '../decorators/user.decorator';
import { PostUserRequest } from './dto/postUser/post-user.request';
import { PostUserResponse } from './dto/postUser/post-user.response';
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
    description: '전화번호의 길이를 확인해주세요.',
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
}
