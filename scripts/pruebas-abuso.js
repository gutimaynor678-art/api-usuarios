// scripts/pruebas-abuso.js: pruebas de abuso contra TU PROPIA API (local o desplegada)
//   node scripts/pruebas-abuso.js flood 30   -> envía 30 GET seguidos y cuenta los códigos
//   node scripts/pruebas-abuso.js grande     -> envía un cuerpo de ~20 KB
const base = process.env.API_URL ?? 'http://localhost:3000';
const modo = process.argv[2];

if (modo === 'flood') {
  const total = Number(process.argv[3] ?? 30);
  const conteo = {};
  for (let i = 0; i < total; i++) {
    const r = await fetch(`${base}/api/usuarios`);
    conteo[r.status] = (conteo[r.status] ?? 0) + 1;
  }
  console.log(`${total} peticiones a ${base}:`, conteo);
} else if (modo === 'grande') {
  const r = await fetch(`${base}/api/usuarios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre: 'A'.repeat(20000), correo: 'x@example.com' }),
  });
  console.log('Cuerpo de ~20 KB ->', r.status);
} else {
  console.log('Uso: node scripts/pruebas-abuso.js flood [n] | grande');
}