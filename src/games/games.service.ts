import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from './game.entity';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game)
    private readonly gamesRepository: Repository<Game>,
  ) {}

  findAll(): Promise<Game[]> {
    return this.gamesRepository.find({
      relations: { odds: { bookmaker: true } },
      order: { startTime: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Game> {
    const game = await this.gamesRepository.findOne({
      where: { id },
      relations: { odds: { bookmaker: true } },
    });

    if (!game) {
      throw new NotFoundException(`Jogo ${id} não encontrado`);
    }

    return game;
  }
}
