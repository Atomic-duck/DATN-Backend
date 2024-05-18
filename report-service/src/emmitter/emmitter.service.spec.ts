import { Test, TestingModule } from '@nestjs/testing';
import { EmmitterService } from './emmitter.service';

describe('EmmitterService', () => {
  let service: EmmitterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmmitterService],
    }).compile();

    service = module.get<EmmitterService>(EmmitterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
