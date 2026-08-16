import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AffiliateClick } from './affiliate-click.entity';
import { AffiliateClicksService } from './affiliate-clicks.service';
import { AffiliateClicksController } from './affiliate-clicks.controller';
import { BookmakersModule } from '../bookmakers/bookmakers.module';
import { GamesModule } from '../games/games.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AffiliateClick]),
    BookmakersModule,
    GamesModule,
  ],
  controllers: [AffiliateClicksController],
  providers: [AffiliateClicksService],
})
export class AffiliateClicksModule {}
