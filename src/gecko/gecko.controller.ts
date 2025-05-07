import { Controller, Get } from '@nestjs/common';
import { GeckoService } from './gecko.service';

@Controller('api/v1/pools')
export class GeckoController {
  constructor(private readonly geckoService: GeckoService) {}

  @Get("top")
  async getPools() {
    return this.geckoService.getAllPools();
  }

  //@Get(":id")
  //async getPoolById() {
  //  return this.geckoService.getAllPools();
  //}

  //@Get("history/:id")
  //async getPoolHistory() {
  //  return this.geckoService.getAllPools();
  //}
}
