import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alert } from './alert.entity';
import { AlertStatus } from './alert-status.enum';
import { Odd } from '../odds/odd.entity';
import { CreateAlertDto } from './dto/create-alert.dto';

@Injectable()
export class AlertsService {
  constructor(
    @InjectRepository(Alert)
    private readonly alertsRepository: Repository<Alert>,
    @InjectRepository(Odd)
    private readonly oddsRepository: Repository<Odd>,
  ) {}

  findAll(): Promise<Alert[]> {
    return this.alertsRepository.find({
      relations: { game: true, triggeredBookmaker: true },
      order: { createdAt: 'DESC' },
    });
  }

  create(dto: CreateAlertDto): Promise<Alert> {
    const alert = this.alertsRepository.create({
      ...dto,
      status: AlertStatus.ATIVO,
    });
    return this.alertsRepository.save(alert);
  }

  async remove(id: string): Promise<void> {
    const result = await this.alertsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Alerta ${id} não encontrado`);
    }
  }

  // Disparo manual/simulado (equivalente ao "Simular disparo" do frontend).
  // O disparo automatico via worker comparando odds ao vivo e escopo da Fase 6.
  async trigger(id: string): Promise<Alert> {
    const alert = await this.alertsRepository.findOne({ where: { id } });
    if (!alert) {
      throw new NotFoundException(`Alerta ${id} não encontrado`);
    }

    const bestOdd = await this.oddsRepository.findOne({
      where: {
        gameId: alert.gameId,
        market: alert.market,
        selection: alert.selection,
      },
      order: { value: 'DESC' },
    });

    alert.status = AlertStatus.DISPARADO;
    alert.triggeredAt = new Date();
    alert.triggeredBookmakerId = bestOdd?.bookmakerId;

    return this.alertsRepository.save(alert);
  }
}
