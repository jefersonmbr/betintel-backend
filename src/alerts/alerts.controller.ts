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
  UseGuards,
} from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertDto } from './dto/update-alert.dto';
import { Alert } from './alert.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { CurrentUserPayload } from '../auth/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get()
  findAll(@CurrentUser() user: CurrentUserPayload): Promise<Alert[]> {
    return this.alertsService.findAllForUser(user.id);
  }

  @Post()
  create(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: CreateAlertDto,
  ): Promise<Alert> {
    return this.alertsService.create(user.id, dto);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
    @Body() dto: UpdateAlertDto,
  ): Promise<Alert> {
    return this.alertsService.update(id, user.id, dto);
  }

  @Patch(':id/cancel')
  cancel(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
  ): Promise<Alert> {
    return this.alertsService.cancel(id, user.id);
  }

  @Patch(':id/trigger')
  trigger(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
  ): Promise<Alert> {
    return this.alertsService.trigger(id, user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
  ): Promise<void> {
    return this.alertsService.remove(id, user.id);
  }
}
