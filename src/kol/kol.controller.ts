import {
  HttpCode,
  Delete,
  Get,
  Post,
  Controller,
  Body,
  Logger,
  Param,
} from '@nestjs/common';
import { ApiBody, ApiParam } from '@nestjs/swagger';
import { KolService } from './kol.service';

@Controller('api/v1/kol')
export class KolController {
  private readonly logger = new Logger(KolController.name);

  constructor(private readonly twitterService: KolService) {}

  @Get('tweet/:media_acount')
  @ApiParam({
    name: 'media_acount',
    required: true,
    description: 'Media account to fetch tweets from',
  })
  async getTweetByAccount(
    @Param('media_acount') media_acount: string,
  ): Promise<any> {
    try {
      this.logger.log(
        `Received media account to fetch tweets: ${media_acount}`,
      );
      // Validate the media account
      if (!media_acount || typeof media_acount !== 'string') {
        throw new Error('Invalid media account');
      }
      this.logger.log(
        `Received media account to fetch tweets: ${media_acount}`,
      );
      const tweets = await this.twitterService.getTweetsByAccount(media_acount);
      return tweets[0].content;
      //return { tweets };
    } catch (error) {
      this.logger.error(
        `Error fetching tweets for media account: ${media_acount}`,
        error,
      );
      throw new Error('Error fetching tweets for media account');
    }
  }

  @Post('tweet_binding')
  @HttpCode(200)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        media_acount: { type: 'string' },
        media_name: { type: 'string' },
        chat_id: { type: 'string' },
      },
    },
  })
  async postTweet(
    @Body() body: { media_acount: string; media_name: string; chat_id: string },
  ): Promise<any> {
    const { media_acount, media_name, chat_id } = body;
    try {
      // Validate the media account
      if (!media_acount || typeof media_acount !== 'string') {
        throw new Error('Invalid media account');
      }
      this.logger.log(`Received media account: ${media_acount}`);
      await this.twitterService.fetchTweets(media_acount, media_name, chat_id);
    } catch (error) {
      this.logger.error(`Invalid media account: ${media_acount}`);
      throw new Error('Invalid media account');
    }

    return { message: 'Tweet posted successfully' };
  }

  @Post('generate')
  @HttpCode(200)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        req: { type: 'string' },
        user_id: { type: 'string' },
      },
    },
  })
  async generateTweet(
    @Body() body: { req: string; user_id: string },
  ): Promise<string> {
    const { req, user_id } = body;
    this.logger.log(`Received request to generate tweet: ${req}`);
    try {
      const content = await this.twitterService.generateTweet(user_id, req);
      return content;
    } catch (error) {
      this.logger.error(`Error generating tweet: ${error.message}`);
      throw new Error(`Error generating tweet: ${error.message}`);
    }
  }

  @Post('gen')
  @HttpCode(200)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        req: { type: 'string' },
        chat_id: { type: 'string' },
      },
    },
  })
  async generateTweetByChatId(
    @Body() body: { req: string; chat_id: string },
  ): Promise<string> {
    const { req, chat_id } = body;
    this.logger.log(`Received request to generate tweet: ${req}`);
    try {
      const content = await this.twitterService.generateTweetByChatId(
        chat_id,
        req,
      );
      return content;
    } catch (error) {
      this.logger.error(`Error generating tweet: ${error.message}`);
      throw new Error(`Error generating tweet: ${error.message}`);
    }
  }

  @Post('binding')
  @HttpCode(200)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        bot_name: { type: 'string' },
        chat_id: { type: 'string' },
        node_id: { type: 'string' },
      },
    },
  })
  async bindingKol(
    @Body() body: { bot_name: string; chat_id: string; node_id: string },
  ): Promise<any> {
    const { bot_name, chat_id, node_id } = body;
    try {
      await this.twitterService.bindingKol(bot_name, chat_id, node_id);
    } catch (error) {
      this.logger.error(`Error binding kol: ${error.message}`);
      throw error;
    }

    //return { message: 'Kol binding successful' };
    return JSON.stringify({ status: 'binding' });
  }
}
