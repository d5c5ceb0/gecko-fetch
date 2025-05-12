import { Test, TestingModule } from '@nestjs/testing';
import { GeckoController } from './gecko.controller';

describe('GeckoController', () => {
  let controller: GeckoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GeckoController],
    }).compile();

    controller = module.get<GeckoController>(GeckoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
