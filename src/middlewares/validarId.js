// Entero positivo: solo dígitos, sin ceros a la izquierda
export function validarId(req, res, next) {
  if (!/^[1-9]\d*$/.test(req.params.id)) {
    return res.status(400).json({ mensaje: 'El id debe ser un entero positivo' });
  }
  next();
}