import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Airline } from 'src/entity/airline.entity';
import { AirlineReview } from 'src/entity/airlineReview.entity';
import { AirlineReviewReport } from 'src/entity/airlineReviewReport.entity';
import { AirlineService as AirlineServiceEntity } from 'src/entity/airlineService.entity';
import { ReviewAirlineService } from 'src/entity/reviewAirlineService.entity';
import { ReviewReportReason } from 'src/entity/reviewReportReason.entity';
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
      AirlineReviewReport,
      ReviewReportReason,
    ]),
  ],
  controllers: [AirlineController],
  providers: [AirlineService, AirlineQuery],
  exports: [AirlineQuery],
})
export class AirlineModule {}
