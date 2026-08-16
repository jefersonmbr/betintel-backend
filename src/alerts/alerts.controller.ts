import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertDto } from './dto/update-alert.dto';
import { Alert } from './alert.entity';

@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get()
  findAll(): Promise<Alert[]> {
    return this.alertsService.findAll();
  }

  @Post()
  create(@Body() dto: CreateAlertDto): Promise<Alert> {
    return this.alertsService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAlertDto): Promise<Alert> {
    return this.alertsService.update(id, dto);
  }

  @Patch(':id/cancel')
  cancel(@Param('id') id: string): Promise<Alert> {
    return this.alertsService.cancel(id);
  }

  @Patch(':id/trigger')
  trigger(@Param('id') id: string): Promise<Alert> {
    return this.alertsService.trigger(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<void> {
    return this.alertsService.remove(id);
  }
}
