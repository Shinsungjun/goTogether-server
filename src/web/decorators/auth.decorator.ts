import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';
import { regularExp } from 'config/regular.exp';
import { response } from 'config/response.utils';

export const GetDuplicateId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const getDuplicateIdData = ctx.switchToHttp().getRequest().query;
    if (!getDuplicateIdData.userName) {
      throw new HttpException(response.USER_USERNAME_EMPTY, 200);
    }
    if (
      getDuplicateIdData.userName.length <= 0 ||
      getDuplicateIdData.userName > 15
    ) {
      throw new HttpException(response.INVALID_USER_USERNAME, 200);
    }

    return getDuplicateIdData;
  },
);

export const SendSMS = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const sendSMSData = ctx.switchToHttp().getRequest().body;

    if (!sendSMSData.phoneNumber) {
      throw new HttpException(response.USER_PHONENUMBER_EMPTY, 201);
    }
    if (!regularExp.phoneNumberRegex.test(sendSMSData.phoneNumber)) {
      throw new HttpException(response.INVALID_USER_PHONENUMBER, 201);
    }

    return sendSMSData;
  },
);

export const VerifySMS = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const verifySMSData = ctx.switchToHttp().getRequest().query;

    if (!verifySMSData.phoneNumber) {
      throw new HttpException(response.USER_PHONENUMBER_EMPTY, 200);
    }
    if (!regularExp.phoneNumberRegex.test(verifySMSData.phoneNumber)) {
      throw new HttpException(response.INVALID_USER_PHONENUMBER, 200);
    }
    if (!verifySMSData.verifyCode) {
      throw new HttpException(response.VERIFY_CODE_EMPTY, 200);
    }
    if (verifySMSData.verifyCode.length != 6) {
      throw new HttpException(response.INVALID_VERIFY_CODE, 200);
    }

    return verifySMSData;
  },
);

export const SignIn = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const signInData = ctx.switchToHttp().getRequest().body;

    if (!signInData.userName) {
      throw new HttpException(response.USER_USERNAME_EMPTY, 201);
    }
    if (signInData.userName.length <= 0 || signInData.userName > 15) {
      throw new HttpException(response.INVALID_USER_USERNAME, 201);
    }
    if (!signInData.password) {
      throw new HttpException(response.USER_PASSWORD_EMPTY, 201);
    }
    if (!regularExp.passwordRegex.test(signInData.password)) {
      throw new HttpException(response.INVALID_USER_PASSWORD, 201);
    }

    return signInData;
  },
);

export const GetId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const getIdData = ctx.switchToHttp().getRequest().query;

    if (!getIdData.phoneNumber) {
      throw new HttpException(response.USER_PHONENUMBER_EMPTY, 201);
    }
    if (!regularExp.phoneNumberRegex.test(getIdData.phoneNumber)) {
      throw new HttpException(response.INVALID_USER_PHONENUMBER, 201);
    }

    return getIdData;
  },
);
