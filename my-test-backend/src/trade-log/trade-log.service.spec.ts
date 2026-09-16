import { Test, TestingModule } from '@nestjs/testing';
import { TradeLogService } from './trade-log.service.js';

describe('TradeLogService', () => {
  let service: TradeLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TradeLogService],
    }).compile();

    service = module.get<TradeLogService>(TradeLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
