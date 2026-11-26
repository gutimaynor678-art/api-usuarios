import { pool } from '../config/db.js';

// Constante del programador (nunca un dato que venga del cliente)
const COLUMNAS = 'id, nombre, correo, telefono, activo, creado_en';

// GET /api/usuarios
export const listar = async (req, res) => {
  const { columna, dir, q, limite, pagina } = res.locals.consulta;

  // columna y dir salen de la lista blanca (nunca del cliente); los VALORES van parametrizados
  const { rows } = await pool.query(
    `SELECT ${COLUMNAS} FROM usuarios
       WHERE nombre ILIKE $1
       ORDER BY ${columna} ${dir}
       LIMIT $2 OFFSET $3`,
    [`%${q}%`, limite, (pagina - 1) * limite]
  );
  res.json(rows);
};

// GET /api/usuarios/:id
export const obtener = async (req, res) => {
  const { rows } = await pool.query(
    `SELECT ${COLUMNAS} FROM usuarios WHERE id = $1`,
    [req.params.id]
  );
  if (rows.length === 0) {
    return res.status(404).json({ mensaje: 'Usuario no encontrado' });
  }
  res.json(rows[0]);
};

// POST /api/usuarios
export const crear = async (req, res) => {
  const { nombre, correo, telefono } = req.body;
  const { rows } = await pool.query(
    `INSERT INTO usuarios (nombre, correo, telefono)
     VALUES ($1, $2, $3)
     RETURNING ${COLUMNAS}`,
    [nombre, correo, telefono]
  );
  res.status(201).json(rows[0]);
};

// PUT /api/usuarios/:id
export const actualizar = async (req, res) => {
  const { nombre, correo, telefono } = req.body;
  const { rows } = await pool.query(
    `UPDATE usuarios SET nombre = $1, correo = $2, telefono = $3
     WHERE id = $4
     RETURNING ${COLUMNAS}`,
    [nombre, correo, telefono, req.params.id]
  );
  if (rows.length === 0) {
    return res.status(404).json({ mensaje: 'Usuario no encontrado' });
  }
  res.json(rows[0]);
};

// DELETE /api/usuarios/:id
export const eliminar = async (req, res) => {
  const { rowCount } = await pool.query(
    'DELETE FROM usuarios WHERE id = $1',
    [req.params.id]
  );
  if (rowCount === 0) {
    return res.status(404).json({ mensaje: 'Usuario no encontrado' });
  }
  res.status(204).send();
};