import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Twitter } from './entities/twitter.entity';
import { FetchDate } from './entities/fetch_date.entity';
import { Content } from './entities/content.entity';
import { TweetParserService } from './twitter-parser.service';
import { Meme } from './entities/meme.entity';

interface Tweet {
  created_at: string;
  tweet_id: string;
  content: string;
}

@Injectable()
export class TwitterService {
  private readonly logger = new Logger(TwitterService.name);
  private readonly headers: Record<string, string>;

  constructor(
    private readonly tweetParserService: TweetParserService,
    private readonly httpService: HttpService,
    private configService: ConfigService,
    @InjectRepository(Meme)
    private readonly memeRepository: Repository<Meme>,
    @InjectRepository(FetchDate)
    private readonly fetchRepository: Repository<FetchDate>,
    @InjectRepository(Content)
    private readonly contentRepository: Repository<Content>,
    @InjectRepository(Twitter)
    private readonly twitterRepository: Repository<Twitter>,
  ) {
    this.headers = {
      'x-rapidapi-key': this.configService.get<string>('RAPID_API_KEY') || '',
      'x-rapidapi-host': 'twitter241.p.rapidapi.com',
      'Content-Type': 'application/json',
    };
  }

  async addMediaAccount(
    mediaAccount: string,
    startTime: string,
  ): Promise<void> {
    try {
      this.logger.log(`Adding media account: ${mediaAccount}`);
      let uid = await this.getUserId(mediaAccount);
      this.logger.log(`media account: ${mediaAccount}, uid: ${uid}`);
      let entry = this.twitterRepository.create({
        account: mediaAccount,
        uid: uid,
      });

      await this.twitterRepository.save(entry);

      startTime = new Date(startTime).toISOString();
      let fetchEntry = this.fetchRepository.create({
        twitter_id: uid,
        start_time: startTime,
      });
      await this.fetchRepository.save(fetchEntry);
    } catch (error) {
      this.logger.warn(`Failed to add media account: ${error.message}`);
      throw new Error('Media account not found');
    }
  }

  async getMediaAccounts() {
    try {
      this.logger.log(`Getting media accounts`);
      const acounts = await this.twitterRepository.find();
      return acounts;
    } catch (error) {
      this.logger.warn(`Failed to get media accounts: ${error.message}`);
      throw new Error('Failed to get media accounts');
    }
  }

  async removeMediaAccount(mediaAccount: string): Promise<void> {
    try {
      this.logger.log(`Removing media account: ${mediaAccount}`);
      let twitter = await this.twitterRepository.findOne({
        where: { account: mediaAccount },
      });
      this.twitterRepository.delete({ account: mediaAccount });
      this.fetchRepository.delete({ twitter_id: twitter?.uid });
    } catch (error) {
      this.logger.warn(`Failed to remove media account: ${error.message}`);
      throw new Error('Media account not found');
    }
  }

  async getUserId(mediaAccount: string): Promise<string> {
    const url = 'https://twitter241.p.rapidapi.com/user';

    this.logger.log(`headers: ${JSON.stringify(this.headers)}`);

    try {
      let querystring = { username: mediaAccount };

      const response = await firstValueFrom(
        this.httpService.get(url, {
          params: querystring,
          headers: this.headers,
        }),
      );

      if (response.data.errors) {
        throw new Error('Error fetching user ID');
      }

      return response.data.result.data.user.result.rest_id;
    } catch (error) {
      this.logger.warn(
        `Failed to get user id by media account: ${error.message}`,
      );
      throw new Error('Media account not found');
    }
  }

  //@Cron(CronExpression.EVERY_MINUTE)
  //@Cron(CronExpression.EVERY_HOUR)
  async fetchTweets() {
    this.logger.log('Fetching tweets...');
    const accounts = await this.getMediaAccounts();

    for (const account of accounts) {
      try {
        const fetchData = await this.fetchRepository.findOne({
          where: { twitter_id: account.uid },
          order: { created_at: 'DESC' },
        });

        if (!fetchData) continue;

        this.logger.log(
          `Fetching tweets for account: ${account.account}, at ${fetchData?.start_time}`,
        );

        const tweets = await this.getTweets(account.uid, fetchData.start_time);
        this.logger.log(
          `Fetched ${tweets.length} tweets for account ${account.account}`,
        );
        this.logger.log(`Tweets: ${JSON.stringify(tweets)}`);

        const fetchEntities = tweets.map((tweet) => {
          return this.contentRepository.create({
            twitter_id: account.uid,
            tweet_id: tweet.tweet_id,
            content: tweet.content,
          });
        });

        const memeEntities = tweets.map((tweet) => {
          const result = this.tweetParserService.parseTweet(tweet.content);
          const message = this.tweetParserService.formatOutput(result);
          this.logger.log(`Parsed tweet: ${message}`);
          return this.memeRepository.create({
            tweet_id: tweet.tweet_id,
            content: message,
          });
        });

        this.logger.log(
          `Saving ${fetchEntities.length} tweets for account ${account.account}`,
        );

        for (const entry of fetchEntities) {
          await this.contentRepository.save(entry).catch((error) => {
            this.logger.error(`Failed to save tweet: ${error.message}`);
          });
        }

        for (const entry of memeEntities) {
          await this.memeRepository.save(entry).catch((error) => {
            this.logger.error(`Failed to save meme: ${error.message}`);
          });
        }

        fetchData.start_time = new Date();
        await this.fetchRepository.save(fetchData);
      } catch (error) {
        this.logger.error(
          `Failed to fetch tweets for account ${account.account}: ${error.message}`,
        );
      }
    }
  }

  async getTweets(uid: string, startTime: Date): Promise<Array<Tweet>> {
    let cursor: string | null = null;
    const maxIterations = 100;
    const tweets: Tweet[] = [];
    const url = 'https://twitter241.p.rapidapi.com/user-tweets';
    let querystring = { user: uid, count: '20' };
    let firstCall = true;

    for (let i = 0; i < maxIterations; i++) {
      try {
        if (cursor) {
          querystring['cursor'] = cursor;
        }

        const response = await firstValueFrom(
          this.httpService.get(url, {
            headers: this.headers,
            params: querystring,
          }),
        );

        const tweetsData = response.data;
        const instructions = tweetsData.result.timeline?.instructions || [];

        if (!instructions.length) {
          this.logger.error("no instructions, can't get tweets");
          break;
        }

        const index = firstCall ? 1 : 0;
        if (instructions.length <= index) {
          this.logger.error("no enough instructions, can't get tweets");
          break;
        }
        firstCall = false;

        const resp = instructions[index].entries;
        this.logger.log(`get ${resp.length} entries`);

        for (const item of resp) {
          const entryId = item.entryId || '';

          this.logger.log(`entryId: ${entryId}`);
          if (entryId.includes('tweet')) {
            if (item.content?.itemContent) {
              const data = item.content.itemContent.tweet_results.result.legacy;
              const { created_at, id_str: tweet_id, full_text: content } = data;
              this.logger.log(
                `tweet created time: ${created_at}, tweet id: ${tweet_id}`,
              );

              const tweetTime = new Date(created_at);

              if (tweetTime < startTime) {
                this.logger.log(
                  'tweet created time is before start time, stop getting more tweets',
                );
                return tweets;
              }

              tweets.push({ created_at, tweet_id, content });
            }
          }
        }

        const bottom = tweetsData.cursor?.bottom;
        if (bottom) {
          cursor = bottom;
        } else {
          break;
        }
      } catch (error) {
        this.logger.error(`request error: ${error.message}`);
        break;
      }
    }

    return tweets;
  }

  async getTweetsByAccount(mediaAccount: string): Promise<Array<Tweet>> {
    this.logger.log(`Fetching tweets for account: ${mediaAccount}`);
    const account = await this.twitterRepository.findOne({
      where: { account: mediaAccount },
    });
    if (!account) {
      throw new Error('Media account not found');
    }

    const fetchData = await this.contentRepository.findOne({
      where: { twitter_id: account.uid },
      order: { created_at: 'DESC' },
    });

    if (!fetchData) {
      throw new Error('Fetch data not found');
    }

    return [
      {
        created_at: fetchData.created_at.toISOString(),
        tweet_id: fetchData.tweet_id,
        content: fetchData.content,
      },
    ];
  }

  async getLatestMeme() {
    this.logger.log(`Fetching latest meme...`);
    const latestMeme = await this.memeRepository.findOne({
      where: {},
      order: { created_at: 'DESC' },
    });

    if (!latestMeme) {
      throw new Error('No memes found');
    }

    return latestMeme;
  }
}
