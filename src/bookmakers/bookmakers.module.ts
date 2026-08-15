import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bookmaker } from './bookmaker.entity';
import { BookmakersService } from './bookmakers.service';
import { BookmakersController } from './bookmakers.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Bookmaker])],
  controllers: [BookmakersController],
  providers: [BookmakersService],
  exports: [TypeOrmModule],
})
export class BookmakersModule {}
