import { Controller, Get, Param } from '@nestjs/common';
import { GamesService } from './games.service';
import { Game } from './game.entity';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get()
  findAll(): Promise<Game[]> {
    return this.gamesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Game> {
    return this.gamesService.findOne(id);
  }
}
