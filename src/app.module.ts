import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { GeckoModule } from './gecko/gecko.module';
import { BscModule } from './bsc/bsc.module';
import { TwitterModule } from './twitter/twitter.module';
import { SurveyModule } from './survey/survey.module';
import { KolModule } from './kol/kol.module';



@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: (() => {
        const env = process.env.NODE_ENV;
        if (env === 'prod') return '.env.prod';
        if (env === 'dev') return '.env.dev';
        return '.env'; // fallback
      })(),
    }),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as any,
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
      //logging: true,
      //logger: 'advanced-console',
    }),
    ScheduleModule.forRoot(),
    UserModule, AuthModule, GeckoModule, BscModule, TwitterModule, SurveyModule, KolModule],
})
export class AppModule {}
