import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  OddsIngestionResult,
  OddsIngestionService,
} from './odds-ingestion.service';

@Controller('odds-ingestion')
export class OddsIngestionController {
  constructor(private readonly oddsIngestionService: OddsIngestionService) {}

  // Disparo manual, pra testar sem esperar o cron.
  @Post('run')
  @HttpCode(HttpStatus.OK)
  run(): Promise<OddsIngestionResult> {
    return this.oddsIngestionService.run();
  }
}
