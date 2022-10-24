import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { makeResponse } from 'common/function.utils';
import { Status } from 'common/variable.utils';
import { response } from 'config/response.utils';
import { Airline } from 'src/entity/airline.entity';
import { Repository } from 'typeorm';
import { GetAirlineServicesRequest } from './dto/get-airline-services.request';
import { AirlineService as AirlineServiceEntity } from 'src/entity/airlineService.entity';

@Injectable()
export class AirlineService {
  constructor(
    @InjectRepository(Airline)
    private airlineRepository: Repository<Airline>,
    @InjectRepository(AirlineServiceEntity)
    private airlineServiceRepository: Repository<AirlineServiceEntity>,
  ) {}

  async retrieveAirlines() {
    try {
      const airlines = await this.airlineRepository.find({
        select: ['id', 'name', 'logoImageUrl'],
        where: {
          status: Status.ACTIVE,
        },
      });

      const data = {
        airlines: airlines,
      };

      const result = makeResponse(response.SUCCESS, data);

      return result;
    } catch (error) {
      return response.ERROR;
    }
  }

  async retrieveAirlineServices(
    getAirlineServicesRequest: GetAirlineServicesRequest,
  ) {
    try {
      const airlineServices = await this.airlineServiceRepository.find({
        select: ['id', 'name'],
        where: {
          airlineId: getAirlineServicesRequest.airlineId,
          status: Status.ACTIVE,
        },
      });
      const data = {
        airlineServices: airlineServices,
      };
      const result = makeResponse(response.SUCCESS, data);

      return result;
    } catch (error) {
      return response.ERROR;
    }
  }
}
