import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';
import { regularExp } from 'config/regular.exp';
import { response } from 'config/response.utils';

export const PostUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const postUserData = ctx.switchToHttp().getRequest().body;

    if (!postUserData.phoneNumber) {
      throw new HttpException(response.USER_PHONENUMBER_EMPTY, 201);
    }
    if (!regularExp.phoneNumberRegex.test(postUserData.phoneNumber)) {
      throw new HttpException(response.INVALID_USER_PHONENUMBER, 201);
    }
    if (!postUserData.userName) {
      throw new HttpException(response.USER_USERNAME_EMPTY, 201);
    }
    if (
      postUserData.userName.length <= 0 ||
      postUserData.userName.length > 15
    ) {
      throw new HttpException(response.INVALID_USER_USERNAME, 201);
    }
    if (!postUserData.password) {
      throw new HttpException(response.USER_PASSWORD_EMPTY, 201);
    }
    if (!regularExp.passwordRegex.test(postUserData.password)) {
      throw new HttpException(response.INVALID_USER_PASSWORD, 201);
    }
    if (!postUserData.nickName) {
      throw new HttpException(response.USER_NICKNAME_EMPTY, 201);
    }
    if (!regularExp.nickNameRegex.test(postUserData.nickName)) {
      throw new HttpException(response.INVALID_USER_NICKNAME, 201);
    }

    return postUserData;
  },
);
