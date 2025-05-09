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
    const formatPoolToMarkdown = (pool: any, index: number) => {
        return `Smart Money Buy: *${pool.symbol}*⚡️⚡️⚡️: \n\n⚡️ ${pool.symbol}(${pool.name})\n📍 ${pool.token_address}\n\n⏱️  5m | 1h |6h: *${pool.price_change_percentage}*\n🔄 5m Txs/Vol: *${pool.transactions_5m}*\n💰 Liq: \$*${pool.reserve_in_usd}*🔥\n👥 Holder: -*\n📅 Open: *${pool.pool_created_at}*\n🏆 Top 10: -\n📈 [${pool.dex}](${pool.link})\n\n`;
    }

    const formatPoolToMarkdown2 = (pool: any, index: number) => {
        return `⚡️ ${pool.symbol}(${pool.name})\n📍 ${pool.token_address}\n📈 [${pool.dex}](${pool.link})\n\n`;
    }

    // Then in your controller:
    const pools = await this.geckoService.getAllPools(true);
    const markdown = pools.slice(0,1).map((pool, index) => formatPoolToMarkdown(pool, index)).join('\n');
    const markdown2 = pools.slice(1).map((pool, index) => formatPoolToMarkdown2(pool, index)).join('\n');

    return "🔥*Latest tokens on BNB*\n" + markdown + markdown2 + "\n➕[more](https://pancakeswap.finance/)🔥🔥🔥 \n\n";
  }


  @Get("top")
  async getPools() {
    const formatPoolToMarkdown = (pool: any, index: number) => {
        return `Smart Money Buy: *${pool.symbol}*⚡️⚡️⚡️: \n\n⚡️ ${pool.symbol}(${pool.name})\n📍 ${pool.token_address}\n\n⏱️  5m | 1h |6h: *${pool.price_change_percentage}*\n🔄 5m Txs/Vol: *${pool.transactions_5m}*\n💰 Liq: \$*${pool.reserve_in_usd}*🔥\n👥 Holder: -*\n📅 Open: *${pool.pool_created_at}*\n🏆 Top 10: -\n📈 [${pool.dex}](${pool.link})\n\n`;
    }

    const formatPoolToMarkdown2 = (pool: any, index: number) => {
        return `⚡️ ${pool.symbol}(${pool.name})\n📍 ${pool.token_address}\n📈 [${pool.dex}](${pool.link})\n\n`;
    }

    // Then in your controller:
    const pools = await this.geckoService.getAllPools(false);
    const markdown = pools.slice(0,1).map((pool, index) => formatPoolToMarkdown(pool, index)).join('\n');
    const markdown2 = pools.slice(1).map((pool, index) => formatPoolToMarkdown2(pool, index)).join('\n');

    return "🔥*TOP tokens on BNB*\n" + markdown + markdown2 + "\n➕[more](https://pancakeswap.finance/)🔥🔥🔥 \n\n";

  }

}
