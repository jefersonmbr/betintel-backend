// Postgres local (dev) nao usa SSL; bancos gerenciados (Render, Railway etc.)
// exigem. DB_SSL=true liga isso via env var, sem afetar o dev local.
export const sslConfig =
  process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false;
