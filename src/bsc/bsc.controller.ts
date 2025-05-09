import { Controller, Logger, Get, Post, Body, HttpCode, Query } from '@nestjs/common';
import { BalanceTrackerService } from './bsc.service';
import { CreateAddressDto } from './dto/create-address.dto';

@Controller('bsc')
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
}
