import { HttpCode, Body, UseGuards, Controller, Post, Get, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Logger } from '@nestjs/common';
import {ApiBody} from '@nestjs/swagger';
import { BusinessException } from '../common/exceptions/business.exception';


@Controller('api/v1/user')
export class UserController {
    constructor(private readonly userService: UserService) {}
    
    @UseGuards(JwtAuthGuard)
    @Get()
    getUser(@Request() req) {
        Logger.log('UserController - getUser - req.user', req.user);
        return this.userService.getUser();
    }

    @Post('register')
    @HttpCode(200)
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          username: { type: 'string' },
          password: { type: 'string' },
        },
      }
    })
    async register(@Body() registerDto: { username: string; password: string }) {
        const { username, password } = registerDto;
        return this.userService.register(username, password);
    }

    @Post('login')
    @HttpCode(200)
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          username: { type: 'string' },
          password: { type: 'string' },
        },
      }
  })

    async login(@Body() loginDto: { username: string; password: string }) {
        const { username, password } = loginDto;
        return this.userService.login(username, password);
    }
}
