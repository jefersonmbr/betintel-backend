import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AffiliateClick } from './affiliate-click.entity';
import { Bookmaker } from '../bookmakers/bookmaker.entity';
import { Game } from '../games/game.entity';

@Injectable()
export class AffiliateClicksService {
  constructor(
    @InjectRepository(AffiliateClick)
    private readonly clicksRepository: Repository<AffiliateClick>,
    @InjectRepository(Bookmaker)
    private readonly bookmakersRepository: Repository<Bookmaker>,
    @InjectRepository(Game)
    private readonly gamesRepository: Repository<Game>,
  ) {}

  async recordClickAndGetUrl(
    bookmakerId: string,
    gameId: string,
  ): Promise<string> {
    const bookmaker = await this.bookmakersRepository.findOne({
      where: { id: bookmakerId, active: true },
    });
    if (!bookmaker) {
      throw new NotFoundException(`Bookmaker ${bookmakerId} não encontrado`);
    }

    const game = await this.gamesRepository.findOne({ where: { id: gameId } });
    if (!game) {
      throw new NotFoundException(`Jogo ${gameId} não encontrado`);
    }

    await this.clicksRepository.save(
      this.clicksRepository.create({ bookmakerId, gameId }),
    );

    return bookmaker.affiliateUrl;
  }

  getStatsByBookmaker(): Promise<
    { bookmakerId: string; bookmakerName: string; clicks: string }[]
  > {
    return this.clicksRepository
      .createQueryBuilder('click')
      .select('click.bookmakerId', 'bookmakerId')
      .addSelect('bookmaker.name', 'bookmakerName')
      .addSelect('COUNT(*)', 'clicks')
      .innerJoin('click.bookmaker', 'bookmaker')
      .groupBy('click.bookmakerId')
      .addGroupBy('bookmaker.name')
      .orderBy('clicks', 'DESC')
      .getRawMany();
  }
}
