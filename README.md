# betintel-backend

API em NestJS + PostgreSQL do BetIntel. Ver [../betintel-frontend](../betintel-frontend)
e [docs/data-model.md](docs/data-model.md) (referência do schema).

## Setup

Requer um Postgres rodando localmente. Copie `.env.example` para `.env` e ajuste
`DB_HOST`/`DB_PORT`/`DB_USERNAME`/`DB_PASSWORD`/`DB_DATABASE` para a sua instância.

```bash
npm install
npm run migration:run   # cria o schema
npm run seed             # popular com dados de exemplo (mesmos do mock do frontend)
npm run start:dev
```

## Scripts úteis

- `npm run migration:generate -- src/database/migrations/NomeDaMigration` — gera uma
  migration a partir da diferença entre as entidades e o schema atual do banco
- `npm run migration:run` / `npm run migration:revert`
- `npm run seed` — popula `bookmakers`, `games` e `odds` com dados de exemplo

## Endpoints

- `GET /bookmakers`
- `GET /games`, `GET /games/:id`
- `POST /alerts`, `GET /alerts`, `PATCH /alerts/:id/trigger`, `DELETE /alerts/:id`

`PATCH /alerts/:id/trigger` é o disparo manual/simulado (equivalente ao "Simular
disparo" do frontend). O disparo automático via worker comparando odds ao vivo é
escopo da Fase 6.
