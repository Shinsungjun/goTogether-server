import { Test, TestingModule } from '@nestjs/testing';
import { AirlineController } from './airline.controller';

describe('AirlineController', () => {
  let controller: AirlineController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AirlineController],
    }).compile();

    controller = module.get<AirlineController>(AirlineController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
