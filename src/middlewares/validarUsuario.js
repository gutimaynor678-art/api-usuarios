// Lista blanca: solo estos campos pueden llegar en el cuerpo
const PERMITIDOS = ['nombre', 'correo', 'telefono'];

// \p{L} = cualquier letra (incluye tildes y ñ). Sin <, >, comillas dobles, ; ni paréntesis.
const REGEX_NOMBRE = /^[\p{L}][\p{L}\s.'-]{2,79}$/u;
const REGEX_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REGEX_TELEFONO = /^9\d{8}$/; // celular peruano: 9 dígitos que empiezan en 9

export function validarUsuario(req, res, next) {
  const cuerpo = req.body ?? {};
  const errores = [];

  // TODO 6: rechazar campos fuera de PERMITIDOS
  const extra = Object.keys(cuerpo).filter((k) => !PERMITIDOS.includes(k));
  if (extra.length > 0) {
    errores.push(`campos no permitidos: ${extra.join(', ')}`);
  }

  // TODO 7: validar con las expresiones regulares
  const { nombre, correo, telefono } = cuerpo;

  if (typeof nombre !== 'string' || !REGEX_NOMBRE.test(nombre.trim())) {
    errores.push('nombre no válido (3 a 80 letras; solo letras, espacios, . \' -)');
  }

  if (
    typeof correo !== 'string' ||
    correo.trim().length > 120 ||
    !REGEX_CORREO.test(correo.trim())
  ) {
    errores.push('correo no válido (máximo 120 caracteres)');
  }

  if (telefono != null) {
    const t = typeof telefono === 'number' ? String(telefono) : telefono;
    if (typeof t !== 'string' || !REGEX_TELEFONO.test(t)) {
      errores.push('teléfono no válido (9 dígitos que empiezan en 9)');
    }
  }

  if (errores.length > 0) {
    return res.status(400).json({ mensaje: 'Datos no válidos', errores });
  }

  req.body = {
    nombre: nombre.trim(),
    correo: correo.trim().toLowerCase(),
    telefono: telefono == null ? null : String(telefono),
  };
  next();
}