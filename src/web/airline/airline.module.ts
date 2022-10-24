import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Airline } from 'src/entity/airline.entity';
import { AirlineService as AirlineServiceEntity } from 'src/entity/airlineService.entity';
import { AirlineController } from './airline.controller';
import { AirlineService } from './airline.service';

@Module({
  imports: [TypeOrmModule.forFeature([Airline, AirlineServiceEntity])],
  controllers: [AirlineController],
  providers: [AirlineService],
})
export class AirlineModule {}
