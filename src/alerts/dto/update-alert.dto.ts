import { IsNumber, Min } from 'class-validator';

export class UpdateAlertDto {
  @IsNumber()
  @Min(1)
  targetOdd: number;
}
