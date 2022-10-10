import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';
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
