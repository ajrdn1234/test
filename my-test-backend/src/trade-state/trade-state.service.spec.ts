import { Test, TestingModule } from '@nestjs/testing';
import { TradeStateService } from './trade-state.service.js';

describe('TradeStateService', () => {
  let service: TradeStateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TradeStateService],
    }).compile();

    service = module.get<TradeStateService>(TradeStateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
