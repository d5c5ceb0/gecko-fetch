import { Controller, Logger, Get, Post, Body, HttpCode, Query } from '@nestjs/common';
import { BalanceTrackerService } from './bsc.service';
import { CreateAddressDto } from './dto/create-address.dto';
import {ApiBody} from '@nestjs/swagger';

@Controller('api/v1/bsc')
export class BscController {
    private readonly logger = new Logger(BscController.name);

    constructor(private readonly bscService: BalanceTrackerService) {}
    
    @Post('address')
    @HttpCode(200)
    async addTrackAddress(@Body() body: CreateAddressDto) {
        this.logger.log(`Adding address to track: ${body.address}, ${body.owner}`);
        let amount = await this.bscService.add_address(body.address, body.owner);
    }

    @Get('address')
    async getTrackAddress(
        @Query('owner') owner: string,
    ) {
        this.logger.log(`Getting tracked addresses`);
        let addresses = await this.bscService.get_addresses(owner);
        return addresses;
    }

    @Post('address/remove')
    @HttpCode(200)
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          address: { type: 'string' },
          owner: { type: 'string' },
        },
      }
  })
    async removeTrackAddress( @Body() body: { address: string, owner: string }) {
        this.logger.log(`Removing address from tracking: ${body.address}`);
        let addresses = await this.bscService.remove_address(body.address, body.owner);
        return addresses;
    }
}
