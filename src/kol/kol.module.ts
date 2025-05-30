import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KolService } from './kol.service';
import { KolController } from './kol.controller';
import { HttpModule } from '@nestjs/axios';
import { KolFetchDate } from './entities/kol-fetch-date.entity';
import { KolTweet } from './entities/kol-tweet.entity';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([KolFetchDate, KolTweet])],
  providers: [KolService],
  controllers: [KolController],
})
export class KolModule {}
