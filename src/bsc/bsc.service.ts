import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { SmartAddress } from './entities/address.entity';
import { Repository } from 'typeorm';
import { ethers } from 'ethers';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class BalanceTrackerService {
  private readonly provider = new ethers.JsonRpcProvider(process.env.BSC_RPC_URL);
  private readonly THRESHOLD = ethers.parseEther('1'); // 1 BNB
  private readonly logger = new Logger(BalanceTrackerService.name);

  constructor(
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
          this.logger.warn(`[alert] address ${entry.address} ${isOut ? 'transferred' : 'recived'} ${ethers.formatEther(diff)} BNB`);

          // TODO: Replace with actual notifier
          const res = await firstValueFrom(
                  //`https://api.telegram.org/bot7715530319:AAFNAAvS6PDycJPI6nRlZeU_SPWyBy_kA38/sendMessage`,
                  //{ headers: { accept: 'application/json' } },
              this.httpService.post(
                `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`,
                {
                  chat_id: entry.owner,
                  text: `address ${entry.address} ${isOut ? 'transferred' : 'recived'} ${ethers.formatEther(diff)} BNB`,
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

  async add_address(address: string, owner: string) {
    const exists = await this.smartRepo.findOne({ where: { address } });
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

    const newAddress = this.smartRepo.create({ address, owner, lastBalance: amount });
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
