import { HttpException, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { response } from 'config/response.utils';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user) {
    if (!user) {
      throw new HttpException(response.CHECK_JWT_TOKEN, 200);
    }
    return user;
  }
}
