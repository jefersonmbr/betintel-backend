import { IsEnum, IsNumber, IsUUID, Min } from 'class-validator';
import { Market, Selection } from '../../odds/market.enum';

export class CreateAlertDto {
  @IsUUID()
  gameId: string;

  @IsEnum(Market)
  market: Market;

  @IsEnum(Selection)
  selection: Selection;

  @IsNumber()
  @Min(1)
  targetOdd: number;
}
