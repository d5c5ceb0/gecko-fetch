import { Logger, Controller, Get, Post, Body, HttpCode } from '@nestjs/common';
import { GeckoService } from './gecko.service';
import { ApiBody } from '@nestjs/swagger';

@Controller('api/v1/pools')
export class GeckoController {
  private readonly logger = new Logger(GeckoController.name);
  constructor(private readonly geckoService: GeckoService) {}


  shortenAddress(address: string, chars = 4): string {
    if (!address) return '';
    return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
  }

  @Get("new")
  async getNewPools() {
    const formatPoolToMarkdown = (pool: any, index: number) => {
        return `Smart Money Buy: *${pool.symbol}*⚡️⚡️⚡️: \n\n⚡️ ${pool.symbol}(${pool.name})\n📍 ${pool.token_address}\n\n⏱️  5m | 1h |6h: *${pool.price_change_percentage}*\n🔄 5m Txs/Vol: *${pool.transactions_5m}*\n💰 Liq: \$*${pool.reserve_in_usd}*🔥\n👥 Holder: -\n📅 Open: *${pool.pool_created_at}*\n🏆 Top 10: -\n📈 [${pool.dex}](${pool.link})\n\n`;
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
        return `Smart Money Buy: *${pool.symbol}*⚡️⚡️⚡️: \n\n⚡️ ${pool.symbol}(${pool.name})\n📍 ${pool.token_address}\n\n⏱️  5m | 1h |6h: *${pool.price_change_percentage}*\n🔄 5m Txs/Vol: *${pool.transactions_5m}*\n💰 Liq: \$*${pool.reserve_in_usd}*🔥\n👥 Holder: -\n📅 Open: *${pool.pool_created_at}*\n🏆 Top 10: -\n📈 [${pool.dex}](${pool.link})\n\n`;
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

  @Post("subscription")
  @HttpCode(200)
  @ApiBody({schema: {
      type: 'object',
      properties: {
          bot_name: { type: 'string' },
          chat_name: { type: 'string' },
          chat_id: { type: 'string' },
          action: { type: 'string', enum: ['subscribe', 'unsubscribe'] },
      }
  }})
  async subscribeTopPools(@Body() body: {bot_name: string, chat_name: string, chat_id: string, action: string}) {
      try {
          this.logger.log('Subscribing to top pools: ' + JSON.stringify(body));
          const { bot_name, chat_name, chat_id, action } = body;
          const pools = await this.geckoService.subscribeTopPools(bot_name, chat_name, chat_id, action);
          return pools;
      } catch (error) {
          throw new Error('Failed to subscribe: ' + error.message);
      }
  }

}
