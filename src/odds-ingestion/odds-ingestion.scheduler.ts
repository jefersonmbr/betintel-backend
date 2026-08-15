import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OddsIngestionService } from './odds-ingestion.service';

@Injectable()
export class OddsIngestionScheduler {
  private readonly logger = new Logger(OddsIngestionScheduler.name);

  constructor(private readonly oddsIngestionService: OddsIngestionService) {}

  // Cadencia provisoria; com um provedor real isso deve respeitar o rate
  // limit do plano contratado.
  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    this.logger.log('Rodando ingestao agendada de odds...');
    await this.oddsIngestionService.run();
  }
}
