import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as webpush from 'web-push';
import { PushSubscription } from './push-subscription.entity';
import { CreatePushSubscriptionDto } from './dto/create-push-subscription.dto';

export type PushPayload = {
  title: string;
  body: string;
  url?: string;
};

@Injectable()
export class PushService implements OnModuleInit {
  private readonly logger = new Logger(PushService.name);

  constructor(
    @InjectRepository(PushSubscription)
    private readonly subscriptionsRepository: Repository<PushSubscription>,
  ) {}

  onModuleInit() {
    const publicKey = process.env.VAPID_PUBLIC_KEY;
    const privateKey = process.env.VAPID_PRIVATE_KEY;
    const subject = process.env.VAPID_SUBJECT ?? 'mailto:contato@betintel.app';

    if (!publicKey || !privateKey) {
      this.logger.warn(
        'VAPID_PUBLIC_KEY/VAPID_PRIVATE_KEY nao configuradas - push notification desativado.',
      );
      return;
    }

    webpush.setVapidDetails(subject, publicKey, privateKey);
  }

  getPublicKey(): string | undefined {
    return process.env.VAPID_PUBLIC_KEY;
  }

  async subscribe(dto: CreatePushSubscriptionDto): Promise<void> {
    const existing = await this.subscriptionsRepository.findOne({
      where: { endpoint: dto.endpoint },
    });
    if (existing) {
      return;
    }

    await this.subscriptionsRepository.save(
      this.subscriptionsRepository.create({
        endpoint: dto.endpoint,
        p256dh: dto.keys.p256dh,
        auth: dto.keys.auth,
      }),
    );
  }

  async unsubscribe(endpoint: string): Promise<void> {
    await this.subscriptionsRepository.delete({ endpoint });
  }

  // Manda pra TODAS as subscriptions cadastradas - nao ha usuario ainda
  // (Fase 8) pra segmentar por dono do alerta.
  async sendToAll(payload: PushPayload): Promise<void> {
    if (!process.env.VAPID_PUBLIC_KEY) {
      return;
    }

    const subscriptions = await this.subscriptionsRepository.find();
    await Promise.all(
      subscriptions.map((subscription) => this.sendOne(subscription, payload)),
    );
  }

  private async sendOne(
    subscription: PushSubscription,
    payload: PushPayload,
  ): Promise<void> {
    try {
      await webpush.sendNotification(
        {
          endpoint: subscription.endpoint,
          keys: { p256dh: subscription.p256dh, auth: subscription.auth },
        },
        JSON.stringify(payload),
      );
    } catch (error: unknown) {
      const statusCode = (error as { statusCode?: number }).statusCode;
      if (statusCode === 404 || statusCode === 410) {
        // subscription expirou ou foi revogada no navegador - limpa
        await this.subscriptionsRepository.delete({ id: subscription.id });
        return;
      }
      this.logger.error(
        `Falha ao enviar push para ${subscription.endpoint}`,
        error,
      );
    }
  }
}
