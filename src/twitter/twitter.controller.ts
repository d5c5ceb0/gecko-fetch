import { Delete, Get, Post, Controller, Body, Logger, Param } from '@nestjs/common';
import { ApiBody, ApiParam } from '@nestjs/swagger';
import { TwitterService } from './twitter.service';


@Controller('api/v1/twitter')
export class TwitterController {
    private readonly logger = new Logger(TwitterController.name);

    constructor(
        private readonly twitterService: TwitterService
    ) {}

    @Post("account")
    @ApiBody({ schema: { type: 'object', properties: { media_acount: { type: 'string' }, start_time: { type: 'string' } } } })
    async postTweet(
        @Body() body: { media_acount: string, start_time: string }
    ): Promise<any> {
        const { media_acount, start_time } = body;
        try {
            // Validate the media account
            if (!media_acount || typeof media_acount !== 'string') {
                throw new Error('Invalid media account');
            }
            this.logger.log(`Received media account: ${media_acount}`);
            await this.twitterService.addMediaAccount(media_acount, start_time);
        } catch (error) {
            this.logger.error(`Invalid media account: ${media_acount}`);
            throw new Error('Invalid media account');
        }

        return { message: 'Tweet posted successfully' };
    }

    @Get("account")
    async getTweet(): Promise<any> {
        try {
            const accounts = await this.twitterService.getMediaAccounts();
            return { accounts };
        } catch (error) {
            this.logger.error('Error fetching media accounts', error);
            throw new Error('Error fetching media accounts');
        }
    }

    @Delete("account")
    @ApiBody({ schema: { type: 'object', properties: { media_acount: { type: 'string' } } } })
    async deleteTweet(
        @Body() body: { media_acount: string }
    ): Promise<any> {
        const { media_acount } = body;
        try {
            // Validate the media account
            if (!media_acount || typeof media_acount !== 'string') {
                throw new Error('Invalid media account');
            }
            this.logger.log(`Received media account for deletion: ${media_acount}`);
            await this.twitterService.removeMediaAccount(media_acount);
        } catch (error) {
            this.logger.error(`Invalid media account for deletion: ${media_acount}`);
            throw new Error('Invalid media account');
        }

        return { message: 'Tweet deleted successfully' };
    }

    @Get("tweet/:media_acount")
    @ApiParam({ name: 'media_acount', required: true, description: 'Media account to fetch tweets from' })
    async getTweetByAccount(
        @Param('media_acount') media_acount: string,
    ): Promise<any> {
        try {
            this.logger.log(`Received media account to fetch tweets: ${media_acount}`);
            // Validate the media account
            if (!media_acount || typeof media_acount !== 'string') {
                throw new Error('Invalid media account');
            }
            this.logger.log(`Received media account to fetch tweets: ${media_acount}`);
            const tweets = await this.twitterService.getTweetsByAccount(media_acount);
            return tweets[0].content;
            //return { tweets };
        } catch (error) {
            this.logger.error(`Error fetching tweets for media account: ${media_acount}`, error);
            throw new Error('Error fetching tweets for media account');
        }
    }

    @Get("meme")
    async getMeme(): Promise<any> {
        try {
            const memes = await this.twitterService.getLatestMeme();
            return memes.content;
        } catch (error) {
            this.logger.error('Error fetching memes', error);
            throw new Error('Error fetching memes');
        }
    }
    
}
