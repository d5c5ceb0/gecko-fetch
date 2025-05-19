import { Module } from '@nestjs/common';
import { TwitterService } from './twitter.service';
import { TweetParserService } from './twitter-parser.service';
import { HttpModule } from '@nestjs/axios';
import { TwitterController } from './twitter.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Twitter } from './entities/twitter.entity';
import { FetchDate } from './entities/fetch_date.entity';
import { Content } from './entities/content.entity';
import { Meme } from './entities/meme.entity';


@Module({
  imports: [
      TypeOrmModule.forFeature([Twitter, FetchDate, Content, Meme]),
      HttpModule
  ],
  providers: [TwitterService, TweetParserService],
  controllers: [TwitterController]
})
export class TwitterModule {}
