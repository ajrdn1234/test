import { Test, TestingModule } from '@nestjs/testing';
import { ExecuteService } from './execute.service.js';

describe('ExecuteService', () => {
  let service: ExecuteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExecuteService],
    }).compile();

    service = module.get<ExecuteService>(ExecuteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
