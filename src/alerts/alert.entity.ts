import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Game } from '../games/game.entity';
import { Bookmaker } from '../bookmakers/bookmaker.entity';
import { Market, Selection } from '../odds/market.enum';
import { AlertStatus } from './alert-status.enum';
import { decimalTransformer } from '../database/decimal.transformer';

// userId entra na Fase 8 (autenticacao); ate la o alerta e anonimo
@Entity('alerts')
export class Alert {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Game, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'gameId' })
  game: Game;

  @Column()
  gameId: string;

  @Column({ type: 'enum', enum: Market })
  market: Market;

  @Column({ type: 'enum', enum: Selection })
  selection: Selection;

  @Column({
    type: 'decimal',
    precision: 6,
    scale: 2,
    transformer: decimalTransformer,
  })
  targetOdd: number;

  @Column({ type: 'enum', enum: AlertStatus, default: AlertStatus.ATIVO })
  status: AlertStatus;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  triggeredAt?: Date;

  // preenchido so no disparo: qual casa ofereceu a odd que bateu o alvo
  @ManyToOne(() => Bookmaker, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'triggeredBookmakerId' })
  triggeredBookmaker?: Bookmaker;

  @Column({ nullable: true })
  triggeredBookmakerId?: string;
}
