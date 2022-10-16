import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Status } from 'common/variable.utils';
import { response } from 'config/response.utils';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { PostUserRequest } from './dto/post-user.request';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { makeResponse } from 'common/function.utils';
import { Payload } from '../auth/jwt/jwt.payload';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async createUser(postUserRequest: PostUserRequest) {
    try {
      // 가입된 전화번호인지 확인
      const isExistUserByPhoneNumber = await this.userRepository.findOne({
        where: {
          phoneNumber: postUserRequest.phoneNumber,
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
          status: Status.ACTIVE,
        },
      });
      if (isExistUserByUserName) {
        return response.EXIST_USERNAME;
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
      };

      const token = this.jwtService.sign(payload);

      const data = {
        createUserId: createUserData.id,
        nickName: createUserData.nickName,
        phoneNumber: createUserData.phoneNumber,
        jwt: token,
      };

      const result = makeResponse(response.SUCCESS, data);

      return result;
    } catch (error) {
      return response.ERROR;
    }
  }
}
