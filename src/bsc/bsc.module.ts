import { Module } from '@nestjs/common';
import { BscController } from './bsc.controller';
import { BalanceTrackerService } from './bsc.service';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmartAddress } from './entities/address.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([SmartAddress]),
  ],
  controllers: [BscController],
  providers: [BalanceTrackerService]
})
export class BscModule {}
