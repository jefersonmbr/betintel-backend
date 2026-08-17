import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  // Nulo pra contas criadas via "Entrar com Google" - nao tem senha, so
  // googleId. As duas colunas sao mutuamente complementares (nunca as duas
  // nulas), nao ha uma constraint de banco pra isso, so validado no
  // AuthService antes de criar o usuario.
  @Column({ nullable: true })
  passwordHash?: string;

  @Column({ nullable: true, unique: true })
  googleId?: string;

  @Column({ nullable: true })
  name?: string;

  @CreateDateColumn()
  createdAt: Date;
}
