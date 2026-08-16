import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AlertsService } from './alerts.service';

@Injectable()
export class AlertsDispatchScheduler {
  constructor(private readonly alertsService: AlertsService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  handleCron() {
    return this.alertsService.runAutoDispatch();
  }
}
