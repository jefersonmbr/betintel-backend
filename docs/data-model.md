# Modelo de dados — BetIntel

Referência para o schema que será implementado no backend (NestJS + Postgres, Fase 2).
A Fase 1 já reflete esse formato nos tipos TypeScript do frontend (`src/types/`) e nos
mocks (`src/mocks/`), para validar o modelo antes de existir backend de verdade.

## Entidades

### Bookmaker (casa de apostas)
- `id` — string slug no frontend (ex: `betano`); Postgres provavelmente usa UUID
- `name`, `logoUrl`, `affiliateUrl` (link de afiliado — placeholder até a Fase 4)
- `active` — permite desativar uma casa sem apagar histórico de odds/cliques

### Game (partida)
- `id`, `homeTeam`, `awayTeam`, `league`
- `startTime` — ISO 8601 completo (data + hora). O modelo antigo (`time: "19:30"`,
  sem data) não é viável pra agendar partidas de verdade.
- `odds: Odd[]` — no Postgres isso é uma tabela separada com FK pra `Game`, aqui no
  frontend vem embutido pra facilitar o mock

### Odd (cotação)
- `bookmakerId`, `market`, `selection`, `value`, `updatedAt`
- `market`/`selection` são union types extensíveis (hoje só `MATCH_RESULT` /
  `HOME` | `DRAW` | `AWAY` estão populados nos mocks, pra bater 1:1 com o
  comportamento atual do app). Novos mercados (over/under, ambas marcam) entram
  sem redesenhar o tipo.
- Representa o **estado atual** da odd (upsert por `gameId + bookmakerId + market +
  selection`). Histórico de variação (pra gráfico/série temporal) vira uma tabela
  `OddHistory` à parte quando a Fase 3 (ingestão) definir a cadência de coleta —
  não faz parte do MVP.

### Alert (alerta de odd)
- `gameId`, `market`, `selection`, `targetOdd`, `status`, `createdAt`
- **Não** referencia um `bookmakerId` na criação — ver decisão de design abaixo
- `triggeredAt?`, `triggeredBookmakerId?` — preenchidos só no disparo, registrando
  qual casa ofereceu a odd que bateu o alvo
- `userId` entra na Fase 8 (autenticação); até lá o alerta continua anônimo

### AffiliateClick (clique rastreado) — construído na Fase 4
- `bookmakerId`, `gameId`, `userId?` (nullable, clique pode ser anônimo),
  `createdAt`. É o log usado pra reconciliar com o relatório de comissão de
  cada programa de afiliados. Não existe tipo/mock no frontend ainda porque é
  um evento que só faz sentido gravado no backend.

### User (usuário) — construído na Fase 8
- `id`, `email`, `name`, `authProvider`, `plan` (`FREE` | `PREMIUM`)

## Decisões de design

- **Market/Selection são union types, não uma tabela dinâmica de mercados.**
  Não há necessidade real hoje de mercados configuráveis por admin — YAGNI até
  aparecer essa necessidade.
- **Alert não trava numa casa específica na criação.** O produto vende "melhor
  odd disponível", não a odd de uma casa fixa. Gravar a casa só no disparo
  conecta o alerta direto ao fluxo de monetização (clique no momento de maior
  intenção).
- **Odd é estado atual, não histórico.** Simplifica a Fase 3; histórico vira
  tabela separada quando for necessário.
- **IDs:** mock usa string slug pra `Bookmaker` (legibilidade no código); a
  escolha de PK no Postgres (UUID, serial, etc.) fica em aberto pra Fase 2.
