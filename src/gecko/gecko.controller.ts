import { Controller, Get } from '@nestjs/common';
import { GeckoService } from './gecko.service';

@Controller('api/v1/pools')
export class GeckoController {
  constructor(private readonly geckoService: GeckoService) {}

  @Get("top")
  async getPools() {
    //# ${id}. ${name}
    //* address: ${address}
    //* reserve: ${reserve}
    //* price in usd: ${name}
    //* created at: ${pool_created_at}
    //* link: [${dex}](${link})

    const formatPoolToMarkdown = (pool: any, index: number) => {
        //return `# ${pool.id}. ${pool.name}
        return `${index + 1}. ${pool.name}
        * address: ${pool.address}
        * reserve: ${pool.reserve_in_usd}
        * created at: ${pool.pool_created_at}
        * link: [${pool.dex}](${pool.link})`;
        
       // * price in usd: ${pool.base_token_price_usd}
    }

    // Then in your controller:
    const pools = await this.geckoService.getAllPools();
    const markdown = pools.map((pool, index) => formatPoolToMarkdown(pool, index)).join('\n');

    return "*Here are the details of the top five trading pairs ranked by liquidity:*⚡️⚡️⚡️ \n\n" + markdown;
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
