import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Odd } from './odd.entity';

// Sem controller ainda: a ingestao de odds (job + upsert) e escopo da Fase 3.
@Module({
  imports: [TypeOrmModule.forFeature([Odd])],
  exports: [TypeOrmModule],
})
export class OddsModule {}
