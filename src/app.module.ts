import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Bookmaker } from './bookmakers/bookmaker.entity';
import { Game } from './games/game.entity';
import { Odd } from './odds/odd.entity';
import { Alert } from './alerts/alert.entity';
import { BookmakersModule } from './bookmakers/bookmakers.module';
import { GamesModule } from './games/games.module';
import { OddsModule } from './odds/odds.module';
import { AlertsModule } from './alerts/alerts.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
        entities: [Bookmaker, Game, Odd, Alert],
        synchronize: false,
      }),
    }),
    BookmakersModule,
    GamesModule,
    OddsModule,
    AlertsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
