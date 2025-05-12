import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pool } from './entities/pool.entity';
import { TopPool } from './entities/top-pool.entity';
import { NewPool } from './entities/new-pool.entity';
import { GeckoService } from './gecko.service';
import { GeckoController } from './gecko.controller';


@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Pool, TopPool, NewPool]),
  ],
  controllers: [GeckoController],
  providers: [GeckoService],
})
export class GeckoModule {}
