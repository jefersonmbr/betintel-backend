import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alert } from './alert.entity';
import { AlertStatus } from './alert-status.enum';
import { Odd } from '../odds/odd.entity';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertDto } from './dto/update-alert.dto';

export type AutoDispatchResult = {
  checked: number;
  triggered: number;
};

@Injectable()
export class AlertsService {
  private readonly logger = new Logger(AlertsService.name);

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

  async update(id: string, dto: UpdateAlertDto): Promise<Alert> {
    const alert = await this.findOneOrFail(id);
    this.assertActive(alert, 'editar');

    alert.targetOdd = dto.targetOdd;
    return this.alertsRepository.save(alert);
  }

  async cancel(id: string): Promise<Alert> {
    const alert = await this.findOneOrFail(id);
    this.assertActive(alert, 'cancelar');

    alert.status = AlertStatus.CANCELADO;
    return this.alertsRepository.save(alert);
  }

  async remove(id: string): Promise<void> {
    const result = await this.alertsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Alerta ${id} não encontrado`);
    }
  }

  // Disparo manual/simulado (equivalente ao "Simular disparo" do frontend) -
  // dispara na hora, independente da odd atual ter batido o alvo ou nao.
  // O disparo automatico de verdade e' runAutoDispatch(), rodado pelo
  // AlertsDispatchScheduler.
  async trigger(id: string): Promise<Alert> {
    const alert = await this.findOneOrFail(id);
    this.assertActive(alert, 'disparar');

    const bestOdd = await this.bestOddFor(alert);

    alert.status = AlertStatus.DISPARADO;
    alert.triggeredAt = new Date();
    alert.triggeredBookmakerId = bestOdd?.bookmakerId;

    return this.alertsRepository.save(alert);
  }

  // Compara cada alerta ativo contra a melhor odd atual do mercado dele;
  // dispara so quando a odd de verdade bateu o alvo.
  async runAutoDispatch(): Promise<AutoDispatchResult> {
    const activeAlerts = await this.alertsRepository.find({
      where: { status: AlertStatus.ATIVO },
    });

    let triggered = 0;
    for (const alert of activeAlerts) {
      const bestOdd = await this.bestOddFor(alert);
      if (!bestOdd || bestOdd.value < alert.targetOdd) {
        continue;
      }

      alert.status = AlertStatus.DISPARADO;
      alert.triggeredAt = new Date();
      alert.triggeredBookmakerId = bestOdd.bookmakerId;
      await this.alertsRepository.save(alert);
      triggered++;
    }

    if (triggered > 0) {
      this.logger.log(
        `Disparo automatico: ${triggered}/${activeAlerts.length} alertas dispararam.`,
      );
    }
    return { checked: activeAlerts.length, triggered };
  }

  private bestOddFor(alert: Alert): Promise<Odd | null> {
    return this.oddsRepository.findOne({
      where: {
        gameId: alert.gameId,
        market: alert.market,
        selection: alert.selection,
      },
      order: { value: 'DESC' },
    });
  }

  private async findOneOrFail(id: string): Promise<Alert> {
    const alert = await this.alertsRepository.findOne({ where: { id } });
    if (!alert) {
      throw new NotFoundException(`Alerta ${id} não encontrado`);
    }
    return alert;
  }

  private assertActive(alert: Alert, action: string): void {
    if (alert.status !== AlertStatus.ATIVO) {
      throw new BadRequestException(`Só é possível ${action} alertas ativos`);
    }
  }
}
