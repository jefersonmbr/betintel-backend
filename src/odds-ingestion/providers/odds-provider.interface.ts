import { Market, Selection } from '../../odds/market.enum';

// Formato normalizado que QUALQUER provedor real (OddsPapi, The Odds API,
// feed de afiliado, etc.) deve produzir. O provedor concreto e' responsavel
// por traduzir o formato proprio dele pra este; o resto da ingestao (match
// com Game/Bookmaker, upsert) nao muda quando o provedor trocar.
export type OddsProviderResult = {
  homeTeam: string;
  awayTeam: string;
  bookmakerSlug: string;
  market: Market;
  selection: Selection;
  price: number;
};

export interface OddsProvider {
  fetchLatestOdds(): Promise<OddsProviderResult[]>;
}

export const ODDS_PROVIDER = 'ODDS_PROVIDER';
