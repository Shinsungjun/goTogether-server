import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { secret } from 'config/secret';
import { UserQuery } from './user.query';
import { AirlineModule } from '../airline/airline.module';
import { AirportModule } from '../airport/airport.module';

@Module({
  imports: [
    AirlineModule,
    AirportModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: secret.jwtSecretKey,
      signOptions: { expiresIn: '30d' },
    }),
  ],
  controllers: [UserController],
  providers: [UserService, UserQuery],
})
export class UserModule {}
