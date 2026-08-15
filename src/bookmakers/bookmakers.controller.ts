import { Controller, Get } from '@nestjs/common';
import { BookmakersService } from './bookmakers.service';
import { Bookmaker } from './bookmaker.entity';

@Controller('bookmakers')
export class BookmakersController {
  constructor(private readonly bookmakersService: BookmakersService) {}

  @Get()
  findAll(): Promise<Bookmaker[]> {
    return this.bookmakersService.findAll();
  }
}
