import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Airport } from 'src/entity/airport.entity';
import { AirportController } from './airport.controller';
import { AirportService } from './airport.service';
import { AirportService as AirportServiceEntity } from 'src/entity/airportSerivce.entity';
import { AirportQuery } from './airport.query';
import { AuthModule } from '../auth/auth.module';
import { AirportReview } from 'src/entity/airportReview.entity';
import { ReviewAirportService } from 'src/entity/reviewAirportService.entity';
import { ReviewReportReason } from 'src/entity/reviewReportReason.entity';
import { AirportReviewReport } from 'src/entity/airportReviewReport.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      Airport,
      AirportServiceEntity,
      AirportReview,
      ReviewAirportService,
      ReviewReportReason,
      AirportReviewReport,
    ]),
  ],
  controllers: [AirportController],
  providers: [AirportService, AirportQuery],
  exports: [AirportQuery],
})
export class AirportModule {}
