import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';


@Injectable()
export class UserService {
    constructor(
        private readonly authService: AuthService,
        @InjectRepository(User) private repo: Repository<User>,
    ) {}

    getUser() {
        return this.repo.find();
    }

  async register(username: string, password: string) {
    //const hashed = await bcrypt.hash(password, 10);
    //this.users.push({ username, password: hashed });
    let entity = this.repo.create({ username, password });
    await this.repo.save(entity);
    return { message: 'User registered' };
  }

  async login(username: string, password: string) {
    //const user = this.users.find(u => u.username === username);
    //if (!user || !(await bcrypt.compare(password, user.password))) {
      //throw new Error('Invalid credentials');
    //}
    //const payload = { username: user.username };
    const token = await this.authService.jwtToken(username);
    Logger.log("token", token);
    return {
      access_token: token
    };
  }
}
