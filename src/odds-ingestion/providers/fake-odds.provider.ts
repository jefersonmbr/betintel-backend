import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Odd } from '../../odds/odd.entity';
import { OddsProvider, OddsProviderResult } from './odds-provider.interface';

// Provedor provisorio (sem provedor real definido ainda - ver Fase 3 do
// roadmap). Le as odds atuais do banco e simula uma pequena variacao de
// mercado a cada chamada, so pra a ingestao ter algo real pra processar.
// Troca por um provedor de verdade e' so trocar o binding de ODDS_PROVIDER
// no odds-ingestion.module.ts - o resto do pipeline nao muda.
@Injectable()
export class FakeOddsProvider implements OddsProvider {
  constructor(
    @InjectRepository(Odd)
    private readonly oddsRepository: Repository<Odd>,
  ) {}

  async fetchLatestOdds(): Promise<OddsProviderResult[]> {
    const odds = await this.oddsRepository.find({
      relations: { game: true, bookmaker: true },
    });

    return odds.map((odd) => ({
      homeTeam: odd.game.homeTeam,
      awayTeam: odd.game.awayTeam,
      bookmakerSlug: odd.bookmaker.slug,
      market: odd.market,
      selection: odd.selection,
      price: this.simulateFluctuation(Number(odd.value)),
    }));
  }

  private simulateFluctuation(currentValue: number): number {
    const deltaPercent = (Math.random() - 0.5) * 0.1; // +-5%
    const next = currentValue * (1 + deltaPercent);
    return Math.max(1.01, Math.round(next * 100) / 100);
  }
}
