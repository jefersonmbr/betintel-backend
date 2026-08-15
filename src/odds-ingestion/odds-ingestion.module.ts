import { Module } from '@nestjs/common';
import { GamesModule } from '../games/games.module';
import { BookmakersModule } from '../bookmakers/bookmakers.module';
import { OddsModule } from '../odds/odds.module';
import { OddsIngestionService } from './odds-ingestion.service';
import { OddsIngestionScheduler } from './odds-ingestion.scheduler';
import { OddsIngestionController } from './odds-ingestion.controller';
import { ODDS_PROVIDER } from './providers/odds-provider.interface';
import { FakeOddsProvider } from './providers/fake-odds.provider';

@Module({
  imports: [GamesModule, BookmakersModule, OddsModule],
  controllers: [OddsIngestionController],
  providers: [
    OddsIngestionService,
    OddsIngestionScheduler,
    { provide: ODDS_PROVIDER, useClass: FakeOddsProvider },
  ],
})
export class OddsIngestionModule {}
