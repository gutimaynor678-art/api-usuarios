// Valida las variables de entorno al arrancar (principio "fallar rápido"):
// si falta una obligatoria, el servidor NO inicia y el log dice cuál es.
const obligatorias = ['DATABASE_URL', 'CORS_ORIGINS'];

const faltan = obligatorias.filter((k) => !process.env[k]);
if (faltan.length > 0) {
  console.error(`Faltan variables de entorno: ${faltan.join(', ')}`);
  process.exit(1);
}

export const config = {
  entorno: process.env.NODE_ENV ?? 'development',
  puerto: Number(process.env.PORT) || 3000,
  databaseUrl: process.env.DATABASE_URL,
  usarSsl: process.env.PGSSL === 'true',
  origenes: process.env.CORS_ORIGINS.split(',')
    .map((s) => s.trim())
    .filter(Boolean),
  limiteMax: Number(process.env.RATE_LIMIT_MAX) || 100,
};