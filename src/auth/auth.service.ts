import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {Logger} from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async jwtToken(username: string) {
    const payload = { username: username };
    Logger.log("payload", payload);

    return this.jwtService.sign(payload);
  }
}
