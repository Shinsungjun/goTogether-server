import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { response } from 'config/response.utils';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { PostSchedule } from '../decorators/schedule.decortor';
import { PostScheduleRequest } from './dto/post-schedule.request';
import { PostScheduleResponse } from './dto/post-schedule.response';
import { ScheduleService } from './schedule.service';

@ApiTags('Schedule API')
@Controller('/web/schedules')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  /*
    description: 일정 등록 api
    requires: postScheduleRequest
    returns: postScheduleResponse
  */
  @ApiOperation({ summary: '일정 등록 API' })
  @ApiResponse({
    status: 1000,
    description: '성공',
    type: PostScheduleResponse,
  })
  @ApiResponse({
    status: 2000,
    description: 'jwt 검증 실패',
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
    status: 2020,
    description: '출발 날짜를 입력해주세요.',
  })
  @ApiResponse({
    status: 2021,
    description: '날짜는 YYYY-MM-DD 형식으로 입력해주세요.',
  })
  @ApiResponse({
    status: 2022,
    description: '도착 날짜를 입력해주세요.',
  })
  @ApiResponse({
    status: 2023,
    description: '일정의 이름을 입력해주세요.',
  })
  @ApiResponse({
    status: 2024,
    description: '일정의 이름은 10자 이내로 입력해주세요.',
  })
  @ApiResponse({
    status: 2025,
    description: '출발 공항의 아이디를 입력해주세요.',
  })
  @ApiResponse({
    status: 2026,
    description: '공항 아이디는 0보다 큰 값을 입력해주세요.',
  })
  @ApiResponse({
    status: 2027,
    description: '도착 공항의 아이디를 입력해주세요.',
  })
  @ApiResponse({
    status: 2028,
    description: '항공사 아이디를 입력해주세요.',
  })
  @ApiResponse({
    status: 2029,
    description: '항공사의 아이디는 0보다 큰 값을 입력해주세요.',
  })
  @ApiResponse({
    status: 2030,
    description: '출발 공항의 서비스 아이디 리스트를 입력해주세요.',
  })
  @ApiResponse({
    status: 2031,
    description: '도착 공항의 서비스 아이디 리스트를 입력해주세요.',
  })
  @ApiResponse({
    status: 2032,
    description: '항공사의 서비스 아이디 리스트를 입력해주세요.',
  })
  @ApiResponse({
    status: 2033,
    description: '유저 아이디를 확인해주세요.',
  })
  @ApiResponse({
    status: 2034,
    description: '존재하지 않는 공항입니다.',
  })
  @ApiResponse({
    status: 2035,
    description: '존재하지 않는 항공사입니다.',
  })
  @ApiResponse({
    status: 4000,
    description: '서버 에러',
  })
  @ApiBody({
    description: '일정 등록 DTO',
    type: PostScheduleRequest,
  })
  @ApiHeader({
    description: 'jwt token',
    name: 'x-access-token',
    example: 'JWT TOKEN',
    required: true,
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  async postSchedule(
    @Req() req: any,
    @PostSchedule() postScheduleRequest: PostScheduleRequest,
  ) {
    const userId = req.user.userId;
    if (userId != postScheduleRequest.userId) {
      return response.USER_ERROR_TYPE;
    }

    return await this.scheduleService.createSchedule(postScheduleRequest);
  }
}
