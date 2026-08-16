import { ValueTransformer } from 'typeorm';

// TypeORM/pg retornam colunas 'decimal' como string por padrao (pra nao
// perder precisao). Nossos valores (odds, targetOdd) cabem em float sem
// problema, e a API fica mais simples de consumir com number de verdade.
export const decimalTransformer: ValueTransformer = {
  to: (value?: number) => value,
  from: (value?: string) =>
    value === null || value === undefined ? value : parseFloat(value),
};
