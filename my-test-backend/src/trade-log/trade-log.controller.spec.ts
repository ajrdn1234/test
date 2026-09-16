import { Test, TestingModule } from '@nestjs/testing';
import { TradeLogController } from './trade-log.controller.js';

describe('TradeLogController', () => {
  let controller: TradeLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TradeLogController],
    }).compile();

    controller = module.get<TradeLogController>(TradeLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
