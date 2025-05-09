import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Pool } from './entities/pool.entity';
import { TopPool } from './entities/top-pool.entity';
import { NewPool } from './entities/new-pool.entity';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GeckoService {
  private readonly logger = new Logger(GeckoService.name);

  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Pool)
    private readonly poolRepo: Repository<Pool>,
    @InjectRepository(TopPool)
    private readonly topPoolRepo: Repository<TopPool>,
    @InjectRepository(NewPool)
    private readonly newPoolRepo: Repository<NewPool>
  ) {}

  @Cron('0 */1 * * * *')
  async fetchNewPools() {
    this.logger.log('start fetching GeckoTerminal API...');
    try {
      const res = await firstValueFrom(
        this.httpService.get(
          'https://api.geckoterminal.com/api/v2/networks/bsc/new_pools?include=base_token&page=1',
          { headers: { accept: 'application/json' } },
        ),
      );

      this.logger.log(`get ${res.data.data.length} pools from GeckoTerminal API`);

      const pools = res.data?.data || [];
      await this.refreshPools(res, true);

      this.logger.log(`success to save ${pools.length} records`);

      const res2 = await firstValueFrom(
        this.httpService.get(
          'https://api.geckoterminal.com/api/v2/networks/bsc/pools?include=base_token&page=1',
          { headers: { accept: 'application/json' } },
        ),
      );

      const pools2 = res2.data?.data || [];
      await this.refreshPools(res2, false);

      this.logger.log(`get ${pools2.length} top pools from GeckoTerminal API`);

    } catch (err) {
      this.logger.error('failed to fetch new pools', err);
    }
  }

  async getAllPools(isNewPool = false): Promise<Pool[]> {
    Logger.log('start fetching pools from topool...');
    // Get the latest record from topool
    let latestToPool;
    try {
        if (isNewPool) {
            latestToPool = await this.newPoolRepo.findOne({
                where: {},  // Add empty where clause
                order: { created_at: 'DESC' }
            });
        } else {
            latestToPool = await this.topPoolRepo.findOne({
                where: {},  // Add empty where clause
                order: { created_at: 'DESC' }
            });
        }
        
    Logger.log(`get ${latestToPool?.pool_ids?.length} pools from topool`);

    if (!latestToPool || !latestToPool.pool_ids) {
        return [];
    }

    // Parse the pool_ids string to array
    const poolIds: string[] = JSON.parse(latestToPool.pool_ids);

    // Get pool records using the ids
    const pools = await this.poolRepo.find({
        select: {
            id: true,
            address: true,
            name: true,
            token_address: true,
            symbol: true,
            price_change_percentage: true,
            transactions_5m: true,
            holders: true,
            top10: true,
            base_token_price_usd: true,
            reserve_in_usd: true,
            dex: true,
            link: true,
            pool_created_at: true,
        },
        where: { id: In(poolIds) },
        take: 5  // Limit to 5 records
    });
    return pools;
    } catch (err) {
        Logger.error('failed to fetch pools from topool', err);
        return [];
    }

  }

  // Add this helper method to the class
  private parseNumber(value: string | number): number {
      try {
          return typeof value === 'string' ? parseFloat(value) : value || 0;
      } catch {
          return 0;
      }
  }

  async refreshPools(res: any, isNewPool = false) {
    const poolList = res.data?.data || [];
    const includeList = res.data?.included || [];
    this.logger.log(`get ${poolList.length} pools from GeckoTerminal API`);

    let poolIds: string[] = [];

    for (const pool of poolList) {
      this.logger.log(`processing pool: ${pool.id}`);
      const attributes = pool.attributes;
      const relationships = pool.relationships;


      const base_token_id = relationships?.base_token?.data?.id || undefined;
      const base_token_name = includeList.find((item: any) => item.id === base_token_id).attributes.name;
      const base_token_symbol = includeList.find((item: any) => item.id === base_token_id).attributes.symbol;
      const base_token_address = includeList.find((item: any) => item.id === base_token_id).attributes.address;
      const price_change_percentage = `${attributes.price_change_percentage.m5}% | ${attributes.price_change_percentage.h1}% | ${attributes.price_change_percentage.h6}%`;

      const transactions_5m = attributes.transactions.m5;
      const volume_5m = attributes.volume_usd.m5;
      const trans_volume_5m = `${transactions_5m.buys+transactions_5m.sells} | \$${volume_5m}`;

      let link;
      if (relationships?.dex?.data?.id === 'pancakeswap-v3-bsc') {
          link = `https://pancakeswap.finance/info/v3/bsc/pairs/${attributes.address}`;
      } else if (relationships?.dex?.data?.id === 'pancakeswap_v2') {
          link = `https://pancakeswap.finance/info/pairs/${attributes.address}`;
      } else if (relationships?.dex?.data?.id === 'pancakeswap-v1-bsc') {
          link = `https://pancakeswap.finance/swap?outputCurrency=${base_token_address}&chainId=56`;
      }

      const newPool = this.poolRepo.create({
          address: attributes.address?.toLowerCase()?.trim() || undefined, // Convert null to undefined
          name: base_token_name || undefined,
          symbol: base_token_symbol || undefined,
          token_address: base_token_address || undefined,
          price_change_percentage: price_change_percentage || undefined,
          transactions_5m: trans_volume_5m || undefined,
          holders: "125",
          top10: "17%",
          base_token_price_usd: this.parseNumber(attributes.base_token_price_usd),
          reserve_in_usd: this.parseNumber(attributes.reserve_in_usd),
          dex: relationships?.dex?.data?.id || undefined,
          link: attributes.address ? link : undefined, // Convert null to undefined
          updated_at: new Date(),
          pool_created_at: attributes.pool_created_at || undefined,


      });

      const p = await this.poolRepo.save(newPool);

      //save new pools id to list
      poolIds.push(p.id.toString());

    }

    let ids = JSON.stringify(poolIds);
    this.logger.log(`pool ids: ${ids}`);

    if (isNewPool) {
      const newPool = this.newPoolRepo.create({
        pool_ids: JSON.stringify(poolIds),
        updated_at: new Date(),
      });
      this.logger.log('Inserting new pool with ID:', newPool);
      await this.newPoolRepo.save(newPool);
    } else {
      const topPool = this.topPoolRepo.create({
        pool_ids: ids,
        updated_at: new Date(),
      });
      this.logger.log('Inserting top pool with ID:', topPool);
      await this.topPoolRepo.save(topPool);
    }
  }
}
