import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AirlineModule } from './web/airline/airline.module';
import { AirportModule } from './web/airport/airport.module';
import { AuthModule } from './web/auth/auth.module';
import { InfoModule } from './web/info/info.module';
import { ScheduleModule } from './web/schedule/schedule.module';
import { SearchModule } from './web/search/search.module';
import { UserModule } from './web/user/user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './config/env/.dev.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: 3306,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: ['dist/src/**/*.entity{.ts,.js}'],
      synchronize: false,
      bigNumberStrings: false,
    }),
    UserModule,
    AuthModule,
    ScheduleModule,
    AirportModule,
    AirlineModule,
    SearchModule,
    InfoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
