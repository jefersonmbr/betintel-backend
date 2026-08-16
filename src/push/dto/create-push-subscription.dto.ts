import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';

class PushSubscriptionKeysDto {
  @IsString()
  p256dh: string;

  @IsString()
  auth: string;
}

// Mesmo formato que PushSubscription.toJSON() do navegador retorna,
// pra nao precisar achatar nada no frontend antes de enviar.
export class CreatePushSubscriptionDto {
  @IsString()
  endpoint: string;

  @ValidateNested()
  @Type(() => PushSubscriptionKeysDto)
  keys: PushSubscriptionKeysDto;
}
