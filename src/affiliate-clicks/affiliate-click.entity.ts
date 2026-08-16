import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Bookmaker } from '../bookmakers/bookmaker.entity';
import { Game } from '../games/game.entity';

// Log de cliques em "Apostar agora", usado pra reconciliar com o relatorio
// de comissao de cada programa de afiliados (ver docs/data-model.md).
// userId entra na Fase 8; ate la o clique e anonimo.
@Entity('affiliate_clicks')
export class AffiliateClick {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Bookmaker, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bookmakerId' })
  bookmaker: Bookmaker;

  @Column()
  bookmakerId: string;

  @ManyToOne(() => Game, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'gameId' })
  game?: Game;

  @Column({ nullable: true })
  gameId?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
