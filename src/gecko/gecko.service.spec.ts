import { Test, TestingModule } from '@nestjs/testing';
import { GeckoService } from './gecko.service';

describe('GeckoService', () => {
  let service: GeckoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GeckoService],
    }).compile();

    service = module.get<GeckoService>(GeckoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
