import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { secret } from 'config/secret';
import { JwtStrategy } from './jwt/jwt.strategy';
import { AuthQuery } from './auth.query';

@Module({
  imports: [
    CacheModule.register(),
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: secret.jwtSecretKey,
      signOptions: { expiresIn: '30d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, AuthQuery],
  exports: [AuthService],
})
export class AuthModule {}
