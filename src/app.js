import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import { config } from './config/env.js';
import { pool } from './config/db.js';
import usuariosRoutes from './routes/usuarios.routes.js';
import { notFound } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

// TODO 1: confiar en el PRIMER proxy (Render/Railway se ubican delante de la app).
// Sin esto, todas las peticiones parecerían venir de una sola IP.
app.set('trust proxy', 2);

// TODO 2: cabeceras de seguridad (también quita X-Powered-By)
app.use(helmet());

// Registro de cada petición (viene de la semana 13)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  next();
});

// TODO 3: CORS con lista blanca
app.use(
  cors({
    origin: (origin, cb) => {
      // Sin cabecera Origin (app móvil, Thunder Client, curl) -> permitir
      if (!origin) return cb(null, true);
      // Origen en la lista blanca -> permitir
      if (config.origenes.includes(origin)) return cb(null, true);
      // Cualquier otro -> rechazar con un error identificable
      const error = new Error('Origen no permitido');
      error.codigo = 'CORS';
      return cb(error);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    maxAge: 600,
  })
);

// TODO 4: cuerpo JSON con límite de 10 kb (evita cuerpos gigantes)
app.use(express.json({ limit: '10kb' }));

// Salud ANTES del limitador: el monitor de la plataforma la consulta con frecuencia
app.get('/api/salud', async (req, res) => {
  const { rows } = await pool.query('SELECT now() AS hora');
    res.json({ version: '1.0.1', estado: 'ok', entorno: config.entorno, hora: rows[0].hora });
});

// TODO 5: limitador general para todo lo que cuelgue de /api
app.use(
  '/api',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: config.limiteMax,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { mensaje: 'Demasiadas peticiones, intente más tarde' },
  })
);

app.use('/api/usuarios', usuariosRoutes);
app.use(notFound);
app.use(errorHandler);

export default app;