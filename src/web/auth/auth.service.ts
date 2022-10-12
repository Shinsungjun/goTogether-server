import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { makeResponse } from 'common/function.utils';
import { Status } from 'common/variable.utils';
import { response } from 'config/response.utils';
import { User } from 'src/entity/user.entity';
import { DataSource, Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { GetDuplicateIdRequest } from './dto/get-duplicate-id.request';
import { SendSMSRequest } from './dto/send-SMS.request';
import * as crypto from 'crypto';
import { messageOption } from 'config/message';
import axios from 'axios';
import { VerifySMSRequest } from './dto/verify-SMS.request';
import { SignInRequest } from './dto/sign-in.request';
import * as bcrypt from 'bcrypt';
import { Payload } from './jwt/jwt.payload';
import { JwtService } from '@nestjs/jwt';
import { GetIdRequest } from './dto/get-id.request';
import { AuthQuery } from './auth.query';
import { CompareIdPhoneNumberRequest } from './dto/compare-id-phoneNumber.request';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtSerivce: JwtService,
    private connection: DataSource,
    private authQuery: AuthQuery,
  ) {}

  private makeSignature() {
    const message = [];
    const hmac = crypto.createHmac('sha256', messageOption.secretKey);
    const space = ' ';
    const newLine = '\n';
    const method = 'POST';
    const timestamp = Date.now().toString();
    const url2 = `/sms/v2/services/${messageOption.serviceId}/messages`;

    message.push(method);
    message.push(space);
    message.push(url2);
    message.push(newLine);
    message.push(timestamp);
    message.push(newLine);
    message.push(messageOption.accessKey);

    //message.join('') 으로 만들어진 string 을 hmac 에 담고, base64로 인코딩한다
    const signature = hmac.update(message.join('')).digest('base64');

    return { signature: signature.toString(), timestamp: timestamp };
  }

  async sendSMS(sendSMSRequest: SendSMSRequest) {
    try {
      // 캐시에 있는 키값 초기화
      await this.cacheManager.del(sendSMSRequest.phoneNumber);

      // 인증번호 생성
      const verifyCode = (
        Math.floor(Math.random() * (999999 - 100000)) + 100000
      ).toString();

      // 만료시간 180초 캐시에 인증번호 저장
      await this.cacheManager.set(sendSMSRequest.phoneNumber, verifyCode, 180);

      const url = `https://sens.apigw.ntruss.com/sms/v2/services/${messageOption.serviceId}/messages`;

      const body = {
        type: 'SMS',
        countryCode: '82',
        from: messageOption.hostPhone,
        contentType: 'COMM',
        content: `[가치가자]\n휴대폰 본인확인 인증번호 [${verifyCode}]`,
        messages: [
          {
            to: sendSMSRequest.phoneNumber.replace(/-/g, ''),
          },
        ],
      };

      // 이메일 보내기위한 signature, timestamp 가져오기
      const authentication = this.makeSignature();

      const options = {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'x-ncp-apigw-timestamp': authentication.timestamp,
          'x-ncp-iam-access-key': messageOption.accessKey,
          'x-ncp-apigw-signature-v2': authentication.signature,
        },
      };

      // 메세지 보내기
      const sendMessageResponse = await axios
        .post(url, body, options)
        .then((result) => {
          return makeResponse(response.SUCCESS, undefined);
        })
        .catch((err) => {
          return response.ERROR;
        });

      return sendMessageResponse;
    } catch (error) {
      return response.ERROR;
    }
  }

  async verifySMS(verifySMSRequest: VerifySMSRequest) {
    try {
      // 캐시 데이터
      const originVerifyCode = await this.cacheManager.get(
        verifySMSRequest.phoneNumber,
      );

      if (originVerifyCode != verifySMSRequest.verifyCode) {
        return response.VERIFY_CODE_NOT_MATCH;
      }

      // 인증 완료 -> 키값 제거
      await this.cacheManager.del(verifySMSRequest.phoneNumber);

      const result = makeResponse(response.SUCCESS, undefined);

      return result;
    } catch (error) {
      return response.ERROR;
    }
  }

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

  async signIn(signInRequest: SignInRequest) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          userName: signInRequest.userName,
          status: Status.ACTIVE,
        },
      });
      if (!user) {
        return response.SIGN_IN_ERROR;
      }
      const passwordCheck = await bcrypt.compare(
        signInRequest.password,
        user.password,
      );
      if (!passwordCheck) {
        return response.SIGN_IN_ERROR;
      }

      const payload: Payload = {
        userId: user.id,
      };
      const token = this.jwtSerivce.sign(payload);

      const data = {
        userId: user.id,
        jwt: token,
      };

      const result = makeResponse(response.SUCCESS, data);

      return result;
    } catch (error) {
      return response.ERROR;
    }
  }

  async retrieveId(getIdRequest: GetIdRequest) {
    const queryRunner = this.connection.createQueryRunner();
    try {
      // 가입된 전화번호인지 확인
      const isExistUserByPhoneNumber = await this.userRepository.findOne({
        where: {
          phoneNumber: getIdRequest.phoneNumber,
          status: Status.ACTIVE,
        },
      });
      if (!isExistUserByPhoneNumber) {
        return response.NON_EXIST_USER;
      }

      const [userIdAndCreatedAt] = await queryRunner.query(
        this.authQuery.retrieveUserIdAndCreatedAtQuery(
          getIdRequest.phoneNumber,
        ),
      );

      const data = {
        userName: userIdAndCreatedAt.userName,
        createdAt: userIdAndCreatedAt.createdAt,
      };

      const result = makeResponse(response.SUCCESS, data);

      return result;
    } catch (error) {
      return response.ERROR;
    } finally {
      await queryRunner.release();
    }
  }

  async compareIdPhoneNumber(
    compareIdPhoneNumberRequest: CompareIdPhoneNumberRequest,
  ) {
    try {
      // 가입된 아이디인지 확인
      const isExistUserByUserName = await this.userRepository.findOne({
        where: {
          userName: compareIdPhoneNumberRequest.userName,
          status: Status.ACTIVE,
        },
      });
      if (!isExistUserByUserName) {
        return response.NON_EXIST_USER;
      }

      // 유저의 전화번호인지 확인
      if (
        compareIdPhoneNumberRequest.phoneNumber !=
        isExistUserByUserName.phoneNumber
      ) {
        return response.USER_PHONENUMBER_ERROR;
      }

      const result = makeResponse(response.SUCCESS, undefined);

      return result;
    } catch (error) {
      return response.ERROR;
    }
  }
}
