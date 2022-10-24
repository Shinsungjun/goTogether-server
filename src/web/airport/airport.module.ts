import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Airport } from 'src/entity/airport.entity';
import { AirportController } from './airport.controller';
import { AirportService } from './airport.service';
import { AirportService as AirportServiceEntity } from 'src/entity/airportSerivce.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Airport, AirportServiceEntity])],
  controllers: [AirportController],
  providers: [AirportService],
})
export class AirportModule {}
