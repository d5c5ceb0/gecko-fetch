import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { SmartAddress } from './entities/address.entity';
import { Repository } from 'typeorm';
import { ethers } from 'ethers';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BalanceTrackerService {
  private readonly provider = new ethers.JsonRpcProvider(process.env.BSC_RPC_URL);
  private readonly THRESHOLD = ethers.parseEther('1'); // 1 BNB
  private readonly logger = new Logger(BalanceTrackerService.name);

  constructor(
    private config: ConfigService,
    private readonly httpService: HttpService,
    @InjectRepository(SmartAddress)
    private readonly smartRepo: Repository<SmartAddress>,
  ) {}

  //@Cron(CronExpression.EVERY_MINUTE)
  @Cron('0 */1 * * * *')
  async handleBalanceCheck() {
    this.logger.log('Checking balances...');
    const addresses = await this.smartRepo.find();

    for (const entry of addresses) {
      try {
        this.logger.log(`Checking address ${entry.address}`);
        if (!entry.address) {
          this.logger.warn('No address found');
          continue;
        }
        const currentBalance = await this.provider.getBalance(entry.address);
        const previous = ethers.parseEther(entry.lastBalance || '0');
        const diff = currentBalance > previous ? currentBalance - previous : previous - currentBalance;
        this.logger.log(`address ${entry.address} current balance: ${ethers.formatEther(currentBalance)}, ${currentBalance}`);
        this.logger.log(`address ${entry.address} previous balance: ${ethers.formatEther(previous)}, ${previous}`);
        this.logger.log(`address ${entry.address} diff: ${ethers.formatEther(diff)}, ${diff}`);
        this.logger.log(`threshold: ${ethers.formatEther(this.THRESHOLD)}, ${this.THRESHOLD}`);



        if (diff >= this.THRESHOLD) {
          const isOut = previous > currentBalance;
          this.logger.warn(`[alert] address ${entry.address} ${isOut ? 'transferred' : 'received'} ${ethers.formatEther(diff)} BNB`);

          const texts = `💰【大户监控 Smart Money Watch】💰🔍🔍\n📍 地址 Address: ${entry.address}\n📈 ${isOut ? '发送Sent' : '收到Received'}: ${ethers.formatEther(diff)} BNB`

          
          const bot_url = this.config.get<string>('TGBOT_URL');
          if (!bot_url) {
              throw new Error('TGBOT_URL is not defined');
          }
          this.logger.log(`TGBOT_URL: ${bot_url}`);

          const res = await firstValueFrom(
              this.httpService.post(
                bot_url,
                {
                  bot_name: entry.botname,
                  data: JSON.stringify({
                      chat_id: entry.owner,
                      text: texts,
                  }),
                },
                { headers: { accept: 'application/json' } },
              )
          );

        }

        entry.lastBalance = ethers.formatEther(currentBalance);
        await this.smartRepo.save(entry);
      } catch (err) {
        this.logger.error(`address ${entry.address} query failed`, err);
      }
    }
  }

  async get_balance(address: string) {
    const balance = await this.provider.getBalance(address);
    return ethers.formatEther(balance).toString();
    //return balance.toString();
  }

  async add_address(address: string, owner: string, botname: string) {
    const exists = await this.smartRepo.findOne({ where: { owner, address } });
    if (exists) {
      return;
    }

    //max 10 addresses each owner
    const count = await this.smartRepo.count({ where: { owner } });
    if (count >= 10) {
      this.logger.error(`Max 10 addresses per owner`);
      throw new Error('Max 10 addresses per owner');
    }

    let amount = await this.get_balance(address)
    this.logger.log(`Balance for ${address}: ${amount}`);

    const newAddress = this.smartRepo.create({ address, owner, botname, lastBalance: amount });
    await this.smartRepo.save(newAddress);
  }

  async get_addresses(owner: string) {
    const addresses = await this.smartRepo.find({ where: { owner } });
    return addresses.map((address) => {
      return {
        owner: address.owner,
        address: address.address,
        lastBalance: address.lastBalance,
      };
    });
  }

  async remove_address(address: string, owner: string) {
    const exists = await this.smartRepo.findOne({ where: { address, owner } });
    if (!exists) {
      this.logger.error(`Address ${address} not found`);
      return
    }

    await this.smartRepo.delete({ address, owner });
    return this.get_addresses(owner);
  }
}
