import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bookmaker } from './bookmaker.entity';

@Injectable()
export class BookmakersService {
  constructor(
    @InjectRepository(Bookmaker)
    private readonly bookmakersRepository: Repository<Bookmaker>,
  ) {}

  findAll(): Promise<Bookmaker[]> {
    return this.bookmakersRepository.find({ where: { active: true } });
  }
}
