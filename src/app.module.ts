import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Bookmaker } from './bookmakers/bookmaker.entity';
import { Game } from './games/game.entity';
import { Odd } from './odds/odd.entity';
import { Alert } from './alerts/alert.entity';
import { AffiliateClick } from './affiliate-clicks/affiliate-click.entity';
import { PushSubscription } from './push/push-subscription.entity';
import { BookmakersModule } from './bookmakers/bookmakers.module';
import { GamesModule } from './games/games.module';
import { OddsModule } from './odds/odds.module';
import { AlertsModule } from './alerts/alerts.module';
import { OddsIngestionModule } from './odds-ingestion/odds-ingestion.module';
import { AffiliateClicksModule } from './affiliate-clicks/affiliate-clicks.module';
import { PushModule } from './push/push.module';
import { sslConfig } from './database/ssl.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_DATABASE'),
        entities: [
          Bookmaker,
          Game,
          Odd,
          Alert,
          AffiliateClick,
          PushSubscription,
        ],
        synchronize: false,
        ssl: sslConfig,
      }),
    }),
    BookmakersModule,
    GamesModule,
    OddsModule,
    AlertsModule,
    OddsIngestionModule,
    AffiliateClicksModule,
    PushModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
