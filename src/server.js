import app from './app.js';
import { config } from './config/env.js';
import { pool } from './config/db.js';

// 0.0.0.0: la plataforma debe poder alcanzar el proceso desde fuera del contenedor
const servidor = app.listen(config.puerto, '0.0.0.0', () => {
  console.log(`API (${config.entorno}) escuchando en el puerto ${config.puerto}`);
});

// Las plataformas envían SIGTERM al reemplazar una versión: cerrar con orden
process.on('SIGTERM', () => {
  console.log('SIGTERM recibido: cerrando conexiones…');
  servidor.close(async () => {
    await pool.end();
    process.exit(0);
  });
});