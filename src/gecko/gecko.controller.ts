import { Controller, Get } from '@nestjs/common';
import { GeckoService } from './gecko.service';

@Controller('api/v1/pools')
export class GeckoController {
  constructor(private readonly geckoService: GeckoService) {}


  shortenAddress(address: string, chars = 4): string {
    if (!address) return '';
    return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
  }

  @Get("new")
  async getNewPools() {
    //# ${id}. ${name}
    //* address: ${address}
    //* reserve: ${reserve}
    //* price in usd: ${name}
    //* created at: ${pool_created_at}
    //* link: [${dex}](${link})

    const formatPoolToMarkdown = (pool: any, index: number) => {
        let addr = this.shortenAddress(pool.address);

            //token_address: true,
            //symbol: true,
            //price_change_percentage: true,
            //transactions_5m: true,
            //holders: true,
            //top10: true,

        //return `⚡️ ${pool.id}. ${pool.name}
        return `⚡️ ${pool.symbol}(${pool.name})
            📍 ${pool.token_address}
            ⏱️  ${pool.price_change_percentage}
            🔄 ${pool.transactions_5m}
            💰 ${pool.reserve_in_usd}
            👥 ${pool.holders}
            📅 ${pool.created_at}
            🏆 ${pool.top10}
            [${pool.dex}](${pool.link})`;
    }

    // Then in your controller:
    const pools = await this.geckoService.getAllPools(true);
    const markdown = pools.map((pool, index) => formatPoolToMarkdown(pool, index)).join('\n');

    return "🔥*TOP tokens on BNB*\n\n*Smart Money Buy: *⚡️⚡️⚡️ \n\n" + markdown;

  }


  @Get("top")
  async getPools() {
    //# ${id}. ${name}
    //* address: ${address}
    //* reserve: ${reserve}
    //* price in usd: ${name}
    //* created at: ${pool_created_at}
    //* link: [${dex}](${link})

    const formatPoolToMarkdown = (pool: any, index: number) => {
        let addr = this.shortenAddress(pool.address);

        //return `# ${pool.id}. ${pool.name}
        return `${index + 1}. ${pool.name}
        \\* address: [${addr}](${pool.link})
        \\* reserve: ${pool.reserve_in_usd}
        \\* created at: ${pool.pool_created_at}
        \\* link: [${pool.dex}](${pool.link})`;
       // * price in usd: ${pool.base_token_price_usd}
    }

    // Then in your controller:
    const pools = await this.geckoService.getAllPools(false);
    const markdown = pools.map((pool, index) => formatPoolToMarkdown(pool, index)).join('\n');

    return "*TOP BSC Bot*\n\n*Here are the details of the top five trading pairs ranked by liquidity:*⚡️⚡️⚡️ \n\n" + markdown;

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
