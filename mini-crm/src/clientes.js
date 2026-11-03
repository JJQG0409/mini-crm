import { readFileSync, writeFile } from 'node:fs';

const RUTA_DATOS = new URL('../data/clientes.json', import.meta.url);

const clientes = JSON.parse(readFileSync(RUTA_DATOS, 'utf-8'));

export class errorValidacion extends Error {
  constuctor(error){
    super(error.join(' '));
    this.error = error;
  }
}

export function obtenerClientes() {
  return clientes;
}

export function obtenerClientePorId(id) {
  return clientes.find((cliente) => cliente.id === Number(id));
}

export function clientesActivos() {
  return clientes.filter((cliente) => cliente.activo);
}

export function totalVentas() {
  return clientes.reduce((total, cliente) => total + Number(cliente.totalCompras), 0);
}

export function resumen() {
  return {
    totalClientes: clientes.length,
    activos: clientesActivos().length,
    ventasTotales: totalVentas(),
  };

function guardarClientes() {
  writeFile(RUTA_DATOS, JSON.stringify(clientes, null, 2)+'\n');
}

// revisar los datos del formulario
function limpiarDatos(datos) {

  const errores = [];
  const texto = (valor) => valor?.toString().trim() || null;
  const nombre = texto(datos.nombre);
  const email = texto(datos.email);
  const totalCompras = Number(datos.totalCompras ?? 0);

  if(!nombre) errores.push('El nombre es obligatorio');

  if(!email) errores.push('El email es obligatorio');

  if (!Number.isFinite(totalCompras) || totalCompras < 0) {
    errores.push('El total de compras debe ser un número mayor o igual a 0');
  }

  if(errores.length) throw new errorValidacion(errores);

  return {
    nombre,
    empresa: texto(datos.empresa),
    email,
    telefono: texto(datos.telefono),
    ciudad: texto(datos.ciudad),
    totalCompras,
    activo: datos.activo !== false,
  };

}










}
