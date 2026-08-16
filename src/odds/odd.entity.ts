import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Game } from '../games/game.entity';
import { Bookmaker } from '../bookmakers/bookmaker.entity';
import { Market, Selection } from './market.enum';
import { decimalTransformer } from '../database/decimal.transformer';

@Entity('odds')
@Index(['game', 'bookmaker', 'market', 'selection'], { unique: true })
export class Odd {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Game, (game) => game.odds, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'gameId' })
  game: Game;

  @Column()
  gameId: string;

  @ManyToOne(() => Bookmaker, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bookmakerId' })
  bookmaker: Bookmaker;

  @Column()
  bookmakerId: string;

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
  value: number;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
