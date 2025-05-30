import { Logger, Injectable, BadRequestException } from '@nestjs/common';
import { KolFetchDate } from './entities/kol-fetch-date.entity';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KolTweet } from './entities/kol-tweet.entity';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { access } from 'fs';

interface ChatRequest {
  model: string;
  messages: ChatMessageInfo[];
}

interface ChatMessageInfo {
  role: string;
  content: string;
}

interface ChatResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface ChatResult {
  content: string;
}

interface Tweet {
  created_at: string;
  tweet_id: string;
  content: string;
}

@Injectable()
export class KolService {
  private readonly logger = new Logger(KolService.name);
  private readonly headers: Record<string, string>;
  private readonly endpoint = 'https://aihubmix.com/v1/chat/completions';

  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
    @InjectRepository(KolFetchDate)
    private readonly fetchRepository: Repository<KolFetchDate>,
    @InjectRepository(KolTweet)
    private readonly contentRepository: Repository<KolTweet>,
  ) {
    this.headers = {
      'x-rapidapi-key': this.configService.get<string>('RAPID_API_KEY') || '',
      'x-rapidapi-host': 'twitter241.p.rapidapi.com',
      'Content-Type': 'application/json',
    };
  }

  async fetchTweets(account: string, name: string, chat_id: string) {
    this.logger.log('Fetching tweets...');
    this.logger.log(`Account: ${account}, Name: ${name}, Chat ID: ${chat_id}`);

    try {
      let fetchData = await this.fetchRepository.findOne({
        where: { twitter_id: account },
        order: { created_at: 'DESC' },
      });

      this.logger.log(
        `Checking fetch data for account ${account}: ${JSON.stringify(fetchData)}`,
      );

      if (!fetchData) {
        const newFetchData = this.fetchRepository.create({
          twitter_id: account,
          twitter_name: name,
          chat_id: chat_id,
          start_time: new Date('2025-02-26T00:00:00Z'), // Default start time
        });
        fetchData = await this.fetchRepository.save(newFetchData);
      }

      this.logger.log(
        `Last fetch time for account ${account}: ${fetchData.start_time}`,
      );

      const tweets = await this.getTweets(account, fetchData.start_time);
      this.logger.log(`Fetched ${tweets.length} tweets for account ${account}`);
      this.logger.log(`Tweets: ${JSON.stringify(tweets)}`);

      const fetchEntities = tweets.map((tweet) => {
        return this.contentRepository.create({
          user_id: account,
          user_name: name,
          tweet_id: tweet.tweet_id,
          content: tweet.content,
          published_at: new Date(tweet.created_at),
        });
      });

      this.logger.log(
        `Saving ${fetchEntities.length} tweets for account ${account}`,
      );

      for (const entry of fetchEntities) {
        await this.contentRepository.save(entry).catch((error) => {
          this.logger.error(`Failed to save tweet: ${error.message}`);
        });
      }

      fetchData.start_time = new Date();
      await this.fetchRepository.save(fetchData);
    } catch (error) {
      this.logger.error(
        `Failed to fetch tweets for account ${account}: ${error.message}`,
      );
    }
  }

  async getTweets(uid: string, startTime: Date): Promise<Array<Tweet>> {
    this.logger.log(
      `Getting tweets for user ID: ${uid}, start time: ${startTime.toISOString()}`,
    );
    let cursor: string | null = null;
    const maxIterations = 3;
    const tweets: Tweet[] = [];
    const url = 'https://twitter241.p.rapidapi.com/user-tweets';
    const querystring = { user: uid, count: '20' };
    let firstCall = true;

    for (let i = 0; i < maxIterations; i++) {
      try {
        if (cursor) {
          querystring['cursor'] = cursor;
        }

        this.logger.log(
          `Fetching tweets for header: ${JSON.stringify(this.headers)}`,
        );

        this.logger.log(`Query parameters: ${JSON.stringify(querystring)}`);

        const response = await firstValueFrom(
          this.httpService.get(url, {
            headers: this.headers,
            params: querystring,
          }),
        );

        this.logger.log(`Response status: ${response.status}`);

        const tweetsData = response.data;
        const instructions = tweetsData.result.timeline?.instructions || [];
        this.logger.log(`Instructions length: ${instructions.length}`);

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
        this.logger.log(`Response entries length: ${resp}`);
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

  async getTweetsByAccount(account: string): Promise<Array<Tweet>> {
    this.logger.log(`Fetching tweets for account: ${account}`);
    const fetchData = await this.contentRepository.findOne({
      where: { user_id: account },
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

  async generateTweetByChatId(chat_id: string, req: string): Promise<string> {
    try {
      this.logger.log(`Generating tweet with request: ${req}`);

      const fetchData = await this.fetchRepository.findOne({
        where: { chat_id: chat_id },
      });

      if (!fetchData) {
        this.logger.error(`Fetch data not found for chat ID: ${chat_id}`);
        throw new Error(`Fetch data not found for chat ID: ${chat_id}`);
      }

      const tweets = await this.contentRepository.find({
        where: { user_id: fetchData.twitter_id },
        order: { created_at: 'DESC' },
      });
      this.logger.log(
        `Fetched ${tweets.length} tweets for user ID: ${fetchData.twitter_id}`,
      );

      const examples = tweets
        .map((item, i) => `Example ${i + 1}: ${item.content}`)
        .join(',');

      const fullPrompt = `You are a witty Twitter ghostwriter. Mimic the style of the following tweets: ${examples} Now write a new tweet on: "${req}" `;

      this.logger.log(`Full prompt for AI: ${fullPrompt}`);

      const response = await this.chat('gemini-2.0-flash-lite', fullPrompt);
      this.logger.log(`Generated tweet: ${response.content}`);
      return response.content;
    } catch (error) {
      this.logger.error(`Failed to generate tweet: ${error.message}`);
      throw new Error(`Failed to generate tweet: ${error.message}`);
    }
  }

  async generateTweet(user_id: string, req: string): Promise<string> {
    try {
      this.logger.log(`Generating tweet with request: ${req}`);

      const tweets = await this.contentRepository.find({
        where: { user_id },
        order: { created_at: 'DESC' },
      });
      this.logger.log(
        `Fetched ${tweets.length} tweets for user ID: ${user_id}`,
      );

      const examples = tweets
        .map((item, i) => `Example ${i + 1}: ${item.content}`)
        .join(',');

      const fullPrompt = `You are a witty Twitter ghostwriter. Mimic the style of the following tweets: ${examples} Now write a new tweet on: "${req}" `;

      this.logger.log(`Full prompt for AI: ${fullPrompt}`);

      const response = await this.chat('gemini-2.0-flash-lite', fullPrompt);
      this.logger.log(`Generated tweet: ${response.content}`);
      return response.content;
    } catch (error) {
      this.logger.error(`Failed to generate tweet: ${error.message}`);
      throw new Error(`Failed to generate tweet: ${error.message}`);
    }
  }

  async chat(model: string, prompt: string): Promise<ChatResult> {
    const body: ChatRequest = {
      model: model,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    };

    this.logger.log(`Sending chat request: ${JSON.stringify(body)}`);

    if (!this.configService.get<string>('AI_MIX_HUB')) {
      throw new Error('AI_MIX_HUB configuration is missing');
    }

    try {
      const response = await firstValueFrom(
        this.httpService.post(this.endpoint, body, {
          headers: {
            Authorization: `Bearer ${this.configService.get<string>('AI_MIX_HUB')}`,
          },
        }),
      );

      const parsed = response.data as ChatResponse;
      const choice = parsed.choices[0];
      Logger.log(`Response: ${JSON.stringify(choice)}`);

      return {
        content: choice.message.content,
      };
    } catch (error) {
      throw new Error(`Chat request failed: ${error.message}`);
    }
  }
  async bindingKol(bot_name: string, chat_id: string, code: string) {
    try {
      let fetchData = await this.fetchRepository.findOne({
        where: { bot_name: bot_name, chat_id: chat_id, node_id: code },
        order: { created_at: 'DESC' },
      });

      if (fetchData) {
        this.logger.log(`Kol already bound: ${JSON.stringify(fetchData)}`);
        return { message: 'Kol already bound' };
      }

      const vak_server = this.configService.get<string>('VAK_SERVER');
      if (!vak_server) {
        //throw new Error('VAK_SERVER configuration is missing');
        throw new BadRequestException('VAK_SERVER configuration is missing');
      }
      this.logger.log(`VAK_SERVER: ${vak_server}`);

      this.logger.log(
        `Binding Kol with code: ${code}, chat ID: ${chat_id}, bot name: ${bot_name}`,
      );

      const res = await firstValueFrom(
        this.httpService.post(
          `${vak_server}/api/v1/model/node/bind_temp`,
          {
            node_id: code,
            chat_id: chat_id,
            bot_name: bot_name,
          },
          { headers: { accept: 'application/json' } },
        ),
      );

      if (res.status !== 200) {
        this.logger.error(`Failed to bind Kol: ${res.statusText}`);
        //throw new Error(`Failed to bind Kol: ${res.statusText}`);
        throw new BadRequestException(`Failed to bind Kol: ${res.statusText}`);
      }
      this.logger.log(`Kol binding response: ${JSON.stringify(res.data)}`);

      this.logger.log(res.data.data.twitter, res.data.data.twitter.twitter_id);

      const newFetchData = this.fetchRepository.create({
        twitter_id: res.data.data.twitter.twitter_id,
        twitter_name: res.data.data.twitter.twitter_name,
        chat_id: chat_id,
        bot_name: bot_name,
        node_id: code,
        start_time: new Date('2025-02-26T00:00:00Z'), // Default start time
      });
      const saved = await this.fetchRepository.save(newFetchData);

      this.logger.log(
        `Last fetch time for account ${saved.twitter_id}: ${saved.start_time}`,
      );

      this.getTweets(saved.twitter_id, saved.start_time).then(
        async (tweets) => {
          this.logger.log(
            `Fetched ${tweets.length} tweets for account ${saved.twitter_id}`,
          );
          this.logger.log(`Tweets: ${JSON.stringify(tweets)}`);

          const fetchEntities = tweets.map((tweet) => {
            return this.contentRepository.create({
              user_id: saved.twitter_id,
              user_name: saved.twitter_name,
              tweet_id: tweet.tweet_id,
              content: tweet.content,
              published_at: new Date(tweet.created_at),
            });
          });

          this.logger.log(
            `Saving ${fetchEntities.length} tweets for account ${saved.twitter_id}`,
          );

          for (const entry of fetchEntities) {
            await this.contentRepository.save(entry).catch((error) => {
              this.logger.error(`Failed to save tweet: ${error.message}`);
            });
          }
        },
      );

      //const tweets = await this.getTweets(saved.twitter_id, saved.start_time);
      //this.logger.log(
      //  `Fetched ${tweets.length} tweets for account ${saved.twitter_id}`,
      //);
      //this.logger.log(`Tweets: ${JSON.stringify(tweets)}`);

      //const fetchEntities = tweets.map((tweet) => {
      //  return this.contentRepository.create({
      //    user_id: saved.twitter_id,
      //    user_name: saved.twitter_name,
      //    tweet_id: tweet.tweet_id,
      //    content: tweet.content,
      //    published_at: new Date(tweet.created_at),
      //  });
      //});

      //this.logger.log(
      //  `Saving ${fetchEntities.length} tweets for account ${saved.twitter_id}`,
      //);

      //for (const entry of fetchEntities) {
      //  await this.contentRepository.save(entry).catch((error) => {
      //    this.logger.error(`Failed to save tweet: ${error.message}`);
      //  });
      //}

      saved.start_time = new Date();
      await this.fetchRepository.save(saved);

      this.logger.log(`Kol binding successful: ${JSON.stringify(saved)}`);
    } catch (error) {
      this.logger.error(`Failed to bind Kol: ${error.message}`);
      throw error;
    }
  }
}
