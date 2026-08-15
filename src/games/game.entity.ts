import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Odd } from '../odds/odd.entity';

@Entity('games')
export class Game {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  homeTeam: string;

  @Column()
  awayTeam: string;

  @Column()
  league: string;

  @Column({ type: 'timestamptz' })
  startTime: Date;

  @OneToMany(() => Odd, (odd) => odd.game)
  odds: Odd[];
}
