import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname } from 'node:path';
import { obtenerClientes, obtenerClientePorId, clientesActivos, resumen } from './clientes.js';
import { buscarClientes } from './busqueda.js';

const PUERTO = process.env.PORT ?? 3000;
const CARPETA_PUBLICA = new URL('../public/', import.meta.url);
const TIPOS_DE_CONTENIDO = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
};

function responderJson(res, estado, datos) {
  res.writeHead(estado, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(datos));
}

// Lo que necesita la lista de la interfaz: sin email, teléfono ni montos.
function datosParaLista({ id, nombre, empresa }) {
  return { id, nombre, empresa };
}

async function servirArchivo(res, ruta) {
  const archivo = new URL(ruta === '/' ? 'index.html' : ruta.slice(1), CARPETA_PUBLICA);
  try {
    if (!archivo.href.startsWith(CARPETA_PUBLICA.href)) throw new Error('Ruta fuera de /public');
    const contenido = await readFile(archivo);
    res.writeHead(200, { 'Content-Type': TIPOS_DE_CONTENIDO[extname(archivo.pathname)] ?? 'application/octet-stream' });
    res.end(contenido);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('No encontrado');
  }
}

async function atenderPeticion(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  console.log(`${new Date().toLocaleTimeString()}  ${req.method} ${url.pathname}${url.search}`);

  // GET /api/resumen
  if (url.pathname === '/api/resumen') {
    return responderJson(res, 200, resumen());
  }

  // GET /api/clientes
  if (url.pathname === '/api/clientes') {
    return responderJson(res, 200, clientesActivos().map(datosParaLista));
  }

  // GET /api/clientes/buscar?q=texto&limite=5
  if (url.pathname === '/api/clientes/buscar') {
    const termino = url.searchParams.get('q') ?? '';
    const limite = Number(url.searchParams.get('limite')) || 5;
    const resultados = buscarClientes(obtenerClientes(), termino, { limite });
    return responderJson(res, 200, resultados.map(datosParaLista));
  }

  // GET /api/clientes/:id
  if (url.pathname.startsWith('/api/clientes/')) {
    const id = url.pathname.split('/')[3];
    const cliente = obtenerClientePorId(id);
    if (!cliente) return responderJson(res, 404, { error: 'Cliente no encontrado' });
    return responderJson(res, 200, cliente);
  }

  return servirArchivo(res, url.pathname);
}

const servidor = createServer(async (req, res) => {
  try {
    await atenderPeticion(req, res);
  } catch (error) {
    console.error(error);
    responderJson(res, 500, { error: 'Error interno del servidor' });
  }
});

servidor.listen(PUERTO, () => {
  console.log(`Mini CRM listo en http://localhost:${PUERTO}`);
});
