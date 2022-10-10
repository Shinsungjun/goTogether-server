import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { makeResponse } from 'common/function.utils';
import { Status } from 'common/variable.utils';
import { response } from 'config/response.utils';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { GetDuplicateIdRequest } from './dto/get-duplicate-id.request';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async retrieveDuplicateId(getDuplicateIdRequest: GetDuplicateIdRequest) {
    try {
      // 가입된 아이디인지 확인
      const isExistUserByUserName = await this.userRepository.findOne({
        where: {
          userName: getDuplicateIdRequest.userName,
          status: Status.ACTIVE,
        },
      });
      if (isExistUserByUserName) {
        return response.EXIST_USERNAME;
      }

      const result = makeResponse(response.SUCCESS, undefined);

      return result;
    } catch (error) {
      return response.ERROR;
    }
  }
}
