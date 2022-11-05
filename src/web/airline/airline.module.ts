import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Airline } from 'src/entity/airline.entity';
import { AirlineReview } from 'src/entity/airlineReview.entity';
import { AirlineService as AirlineServiceEntity } from 'src/entity/airlineService.entity';
import { ReviewAirlineService } from 'src/entity/reviewAirlineService.entity';
import { AuthModule } from '../auth/auth.module';
import { AirlineController } from './airline.controller';
import { AirlineQuery } from './airline.query';
import { AirlineService } from './airline.service';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      Airline,
      AirlineServiceEntity,
      AirlineReview,
      ReviewAirlineService,
    ]),
  ],
  controllers: [AirlineController],
  providers: [AirlineService, AirlineQuery],
  exports: [AirlineQuery],
})
export class AirlineModule {}
