import pg from 'pg';
import { config } from './env.js';

export const pool = new pg.Pool({
  connectionString: config.databaseUrl,
  ssl: config.usarSsl ? { rejectUnauthorized: false } : false,
  max: 5,
  connectionTimeoutMillis: 10000,
});

pool.on('error', (err) => {
  console.error('Error inesperado en el pool:', err.message);
});