import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pool } from './entities/pool.entity';
import { TopPool } from './entities/top-pool.entity';
import { NewPool } from './entities/new-pool.entity';
import { GeckoService } from './gecko.service';
import { GeckoController } from './gecko.controller';
import { SubscriptionEntity } from './entities/subscription.entity';


@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Pool, TopPool, NewPool, SubscriptionEntity]),
  ],
  controllers: [GeckoController],
  providers: [GeckoService],
})
export class GeckoModule {}
