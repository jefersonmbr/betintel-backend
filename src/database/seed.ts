import 'dotenv/config';
import { AppDataSource } from './data-source';
import { Bookmaker } from '../bookmakers/bookmaker.entity';
import { Game } from '../games/game.entity';
import { Odd } from '../odds/odd.entity';
import { Market, Selection } from '../odds/market.enum';

// Espelha src/mocks/{bookmakers,games}.ts do betintel-frontend, pra manter os
// dois lados coerentes enquanto a Fase 5 nao troca o frontend pra API real.
async function seed() {
  const dataSource = await AppDataSource.initialize();

  const bookmakerRepo = dataSource.getRepository(Bookmaker);
  const gameRepo = dataSource.getRepository(Game);
  const oddRepo = dataSource.getRepository(Odd);

  const bookmakers = await bookmakerRepo.save(
    bookmakerRepo.create([
      { slug: 'betano', name: 'Betano', affiliateUrl: '#', active: true },
      { slug: 'kto', name: 'KTO', affiliateUrl: '#', active: true },
      {
        slug: 'betnacional',
        name: 'Betnacional',
        affiliateUrl: '#',
        active: true,
      },
    ]),
  );
  const bookmakerBySlug = new Map(bookmakers.map((b) => [b.slug, b]));

  const games = await gameRepo.save(
    gameRepo.create([
      {
        homeTeam: 'Flamengo',
        awayTeam: 'Palmeiras',
        league: 'Brasileirão',
        startTime: new Date('2026-08-15T19:30:00-03:00'),
      },
      {
        homeTeam: 'Santos',
        awayTeam: 'São Paulo',
        league: 'Brasileirão',
        startTime: new Date('2026-08-15T21:00:00-03:00'),
      },
      {
        homeTeam: 'Corinthians',
        awayTeam: 'Grêmio',
        league: 'Copa do Brasil',
        startTime: new Date('2026-08-15T18:00:00-03:00'),
      },
    ]),
  );

  const oddsSeed = [
    [2.15, 2.05, 2.2],
    [2.4, 2.45, 2.38],
    [1.92, 1.95, 1.9],
  ];

  for (const [index, game] of games.entries()) {
    const [betano, kto, betnacional] = oddsSeed[index];
    await oddRepo.save(
      oddRepo.create([
        {
          gameId: game.id,
          bookmakerId: bookmakerBySlug.get('betano')!.id,
          market: Market.MATCH_RESULT,
          selection: Selection.HOME,
          value: betano,
        },
        {
          gameId: game.id,
          bookmakerId: bookmakerBySlug.get('kto')!.id,
          market: Market.MATCH_RESULT,
          selection: Selection.HOME,
          value: kto,
        },
        {
          gameId: game.id,
          bookmakerId: bookmakerBySlug.get('betnacional')!.id,
          market: Market.MATCH_RESULT,
          selection: Selection.HOME,
          value: betnacional,
        },
      ]),
    );
  }

  console.log(
    `Seed ok: ${bookmakers.length} bookmakers, ${games.length} jogos.`,
  );
  await dataSource.destroy();
}

seed().catch((error: unknown) => {
  console.error('Seed falhou:', error);
  process.exit(1);
});
