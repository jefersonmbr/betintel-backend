import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from '../games/game.entity';
import { Bookmaker } from '../bookmakers/bookmaker.entity';
import { Odd } from '../odds/odd.entity';
import { ODDS_PROVIDER } from './providers/odds-provider.interface';
import type { OddsProvider } from './providers/odds-provider.interface';

export type OddsIngestionResult = {
  processed: number;
  skipped: number;
};

@Injectable()
export class OddsIngestionService {
  private readonly logger = new Logger(OddsIngestionService.name);

  constructor(
    @Inject(ODDS_PROVIDER)
    private readonly provider: OddsProvider,
    @InjectRepository(Game)
    private readonly gamesRepository: Repository<Game>,
    @InjectRepository(Bookmaker)
    private readonly bookmakersRepository: Repository<Bookmaker>,
    @InjectRepository(Odd)
    private readonly oddsRepository: Repository<Odd>,
  ) {}

  async run(): Promise<OddsIngestionResult> {
    const results = await this.provider.fetchLatestOdds();
    let processed = 0;
    let skipped = 0;

    for (const result of results) {
      // Match por nome de time / slug da casa. Um provedor real costuma dar
      // IDs proprios de fixture/bookmaker; nesse caso isso vira uma tabela
      // de mapeamento externo->interno em vez de match por nome.
      const game = await this.gamesRepository.findOne({
        where: { homeTeam: result.homeTeam, awayTeam: result.awayTeam },
      });
      const bookmaker = await this.bookmakersRepository.findOne({
        where: { slug: result.bookmakerSlug },
      });

      if (!game || !bookmaker) {
        skipped++;
        this.logger.warn(
          `Sem match para ${result.homeTeam} x ${result.awayTeam} / ${result.bookmakerSlug}`,
        );
        continue;
      }

      await this.oddsRepository.upsert(
        {
          gameId: game.id,
          bookmakerId: bookmaker.id,
          market: result.market,
          selection: result.selection,
          value: result.price,
          updatedAt: new Date(),
        },
        ['gameId', 'bookmakerId', 'market', 'selection'],
      );
      processed++;
    }

    this.logger.log(
      `Ingestao concluida: ${processed} odds atualizadas, ${skipped} ignoradas.`,
    );
    return { processed, skipped };
  }
}
