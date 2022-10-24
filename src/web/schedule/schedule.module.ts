import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Airline } from 'src/entity/airline.entity';
import { AirlineService } from 'src/entity/airlineService.entity';
import { Airport } from 'src/entity/airport.entity';
import { AirportService } from 'src/entity/airportSerivce.entity';
import { Schedule } from 'src/entity/schedule.entity';
import { ScheduleAirlineService } from 'src/entity/scheduleAirlineService.entity';
import { ScheduleAirportService } from 'src/entity/scheduleAirportService.entity';
import { AuthModule } from '../auth/auth.module';
import { ScheduleController } from './schedule.controller';
import { ScheduleQuery } from './schedule.query';
import { ScheduleService } from './schedule.service';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      Airport,
      Airline,
      AirportService,
      AirlineService,
      ScheduleAirlineService,
      ScheduleAirportService,
      Schedule,
    ]),
  ],
  controllers: [ScheduleController],
  providers: [ScheduleService, ScheduleQuery],
})
export class ScheduleModule {}
