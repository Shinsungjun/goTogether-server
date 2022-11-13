import { HttpException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Status } from 'common/variable.utils';
import { response } from 'config/response.utils';
import { secret } from 'config/secret';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { Payload } from './jwt.payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromHeader('x-access-token'),
      secretOrKey: secret.jwtSecretKey,
      ignoreExpiration: false,
    });
  }

  async validate(payload: Payload) {
    // user 정보 추출
    const user = await this.userRepository.findOne({
      where: {
        id: payload.userId,
        status: Status.ACTIVE,
      },
    });

    if (!user) {
      throw new HttpException(response.CHECK_JWT_TOKEN, 200);
    }
    return payload;
  }
}
