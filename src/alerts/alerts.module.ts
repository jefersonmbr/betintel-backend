import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alert } from './alert.entity';
import { Odd } from '../odds/odd.entity';
import { AlertsService } from './alerts.service';
import { AlertsController } from './alerts.controller';
import { AlertsDispatchScheduler } from './alerts-dispatch.scheduler';
import { PushModule } from '../push/push.module';

@Module({
  imports: [TypeOrmModule.forFeature([Alert, Odd]), PushModule],
  controllers: [AlertsController],
  providers: [AlertsService, AlertsDispatchScheduler],
})
export class AlertsModule {}
