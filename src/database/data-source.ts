import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Bookmaker } from '../bookmakers/bookmaker.entity';
import { Game } from '../games/game.entity';
import { Odd } from '../odds/odd.entity';
import { Alert } from '../alerts/alert.entity';
import { AffiliateClick } from '../affiliate-clicks/affiliate-click.entity';
import { PushSubscription } from '../push/push-subscription.entity';
import { User } from '../users/user.entity';
import { sslConfig } from './ssl.config';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [
    Bookmaker,
    Game,
    Odd,
    Alert,
    AffiliateClick,
    PushSubscription,
    User,
  ],
  migrations: [__dirname + '/migrations/*.{ts,js}'],
  synchronize: false,
  ssl: sslConfig,
});
