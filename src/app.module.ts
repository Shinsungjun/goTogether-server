import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AirlineModule } from './web/airline/airline.module';
import { AirportModule } from './web/airport/airport.module';
import { AuthModule } from './web/auth/auth.module';
import { ScheduleModule } from './web/schedule/schedule.module';
import { SearchModule } from './web/search/search.module';
import { UserModule } from './web/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'jj-database.cyix6flvbh8e.ap-northeast-2.rds.amazonaws.com',
      port: 3306,
      username: 'admin',
      password: 'jjjj1234',
      database: 'jj-dev-db',
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
