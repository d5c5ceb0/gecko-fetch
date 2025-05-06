import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getMessage() {
    return { message: 'api service is running' };
  }
}
