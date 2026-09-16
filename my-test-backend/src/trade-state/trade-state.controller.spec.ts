import { Test, TestingModule } from '@nestjs/testing';
import { TradeStateController } from './trade-state.controller.js';

describe('TradeStateController', () => {
  let controller: TradeStateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TradeStateController],
    }).compile();

    controller = module.get<TradeStateController>(TradeStateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
