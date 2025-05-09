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
        return `⚡️ ${pool.symbol}(${pool.name})\n📍 ${pool.token_address}\n\n⏱️  5m | 1h |6h: *${pool.price_change_percentage}*\n🔄 5m Txs/Vol: *${pool.transactions_5m}*\n💰 Liq: \$${pool.reserve_in_usd}\n👥 Holder: ${pool.holders}\n📅 Open: ${pool.pool_created_at}\n🏆 Top 10: ${pool.top10}\n📈 [${pool.dex}](${pool.link})\n\n`;
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

            //token_address: true,
            //symbol: true,
            //price_change_percentage: true,
            //transactions_5m: true,
            //holders: true,
            //top10: true,

        //return `⚡️ ${pool.id}. ${pool.name}
        return `⚡️ ${pool.symbol}(${pool.name})\n📍 ${pool.token_address}\n\n⏱️  5m | 1h |6h: *${pool.price_change_percentage}*\n🔄 5m Txs/Vol: *${pool.transactions_5m}*\n💰 Liq: \$${pool.reserve_in_usd}\n👥 Holder: ${pool.holders}\n📅 Open: ${pool.pool_created_at}\n🏆 Top 10: ${pool.top10}\n📈 [${pool.dex}](${pool.link})\n\n`;
    }


    // Then in your controller:
    const pools = await this.geckoService.getAllPools(false);
    const markdown = pools.map((pool, index) => formatPoolToMarkdown(pool, index)).join('\n');

    return "🔥*TOP tokens on BNB*\n\n*Smart Money Buy: *⚡️⚡️⚡️ \n\n" + markdown;

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
