import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Pool } from './entities/pool.entity';
import { TopPool } from './entities/top-pool.entity';
import { firstValueFrom } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class GeckoService {
  private readonly logger = new Logger(GeckoService.name);

  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Pool)
    private readonly poolRepo: Repository<Pool>,
    @InjectRepository(TopPool)
    private readonly topPoolRepo: Repository<TopPool>
  ) {}

  @Cron('0 */3 * * * *')
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
      await this.refreshPools(pools);

      this.logger.log(`success to save ${pools.length} records`);
    } catch (err) {
      this.logger.error('failed to fetch new pools', err);
    }
  }

  async getAllPools(): Promise<Pool[]> {
    Logger.log('start fetching pools from topool...');
    // Get the latest record from topool
    try {
    const latestToPool = await this.topPoolRepo.findOne({
        where: {},  // Add empty where clause
        order: { created_at: 'DESC' }
    });
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

  async refreshPools(poolList: any[]) {
    let poolIds: string[] = [];

    for (const pool of poolList) {
      const attributes = pool.attributes;
      const relationships = pool.relationships;

      const newPool = this.poolRepo.create({
          address: attributes.address?.toLowerCase()?.trim() || undefined, // Convert null to undefined
          name: attributes.name?.trim() || undefined,
          base_token_price_usd: this.parseNumber(attributes.base_token_price_usd),
          reserve_in_usd: this.parseNumber(attributes.reserve_in_usd),
          dex: relationships?.dex?.data?.id || undefined,
          link: attributes.address ? `https://pancakeswap.finance/info/pairs/${attributes.address}` : undefined, // Convert null to undefined
          updated_at: new Date(),
          pool_created_at: attributes.pool_created_at || undefined,

      });

      const p = await this.poolRepo.save(newPool);

      //save new pools id to list
      poolIds.push(p.id.toString());

    }
    let ids = JSON.stringify(poolIds);
    this.logger.log(`pool ids: ${ids}`);
    const top = this.topPoolRepo.create({
        pool_ids: ids,
        updated_at: new Date(),
    });
    this.logger.log('Inserting top pool with ID:', top);
    const t = await this.topPoolRepo.save(top);
    this.logger.log(`success to save ${t} records`);
  }
}
