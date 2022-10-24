import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { response } from 'config/response.utils';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { GetSchedules, PostSchedule } from '../decorators/schedule.decortor';
import { GetSchedulesRequest } from './dto/get-schedules.request';
import { GetSchedulesResponse } from './dto/get-schedules.response';
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
    description: '날짜는 YYYY-MM-DD HH:MM 형식으로 입력해주세요.',
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

  /*
    description: 일정 리스트 조회 api
    requires: GetSchedulesRequest
    returns: GetSchedulesResponse
  */
  @ApiOperation({ summary: '일정 리스트 조회 api' })
  @ApiResponse({
    status: 1000,
    description: '성공',
    type: GetSchedulesResponse,
  })
  @ApiResponse({
    status: 2000,
    description: 'jwt 검증 실패',
  })
  @ApiResponse({
    status: 2039,
    description: '조회 type을 입력해주세요.',
  })
  @ApiResponse({
    status: 2040,
    description: '조회 type은 future와 past 중 하나를 입력해주세요.',
  })
  @ApiResponse({
    status: 2041,
    description: '페이지 번호를 입력해주세요.',
  })
  @ApiResponse({
    status: 2042,
    description: '유효하지 않은 페이지 값입니다.',
  })
  @ApiResponse({
    status: 2043,
    description: '존재하지 않는 페이지입니다.',
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
    description: '등록된 일정: future, 지난 일정: past',
    name: 'type',
    type: 'string',
  })
  @ApiQuery({
    description: '페이지 번호',
    name: 'page',
    type: 'number',
    required: false,
  })
  @UseGuards(JwtAuthGuard)
  @Get()
  async getSchedules(
    @Req() req: any,
    @GetSchedules() getSchedulesRequest: GetSchedulesRequest,
  ) {
    const userId = req.user.userId;
    return await this.scheduleService.retrieveSchedules(
      userId,
      getSchedulesRequest,
    );
  }
}
