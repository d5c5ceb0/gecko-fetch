import { Controller, Get, Response } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getMessage() {
    return this.appService.getMessage();
  }

  @Get('health')
  async healthCheck() {
    return {
      status: 'ok',
      message: 'Service is running',
    };
  }

  @Get('ping')
  async ping(@Response() res: any) {
      res.status(200).type('text/plain').send('pong');
  }
}
