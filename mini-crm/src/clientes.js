import { readFileSync, writeFileSync } from 'node:fs';

const RUTA_DATOS = new URL('../data/clientes.json', import.meta.url);

const clientes = JSON.parse(readFileSync(RUTA_DATOS, 'utf-8'));

export class ErrorValidacion extends Error {
  constructor(error){
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
}

  //funcion de crear cliente
export function crearCliente(datos) {

  const cliente = {
      id: Math.max(0, ...clientes.map((c) => c.id)) + 1,
      ...limpiarDatos(datos),
      fechaRegistro: new Date().toISOString().slice(0, 10),
    };
  clientes.push(cliente);
  guardar();
  return cliente;
}

//funcion de actualizar cliente
export function actualizarCliente(id, datos) {
  const cliente = obtenerClientePorId(id);
  if (!cliente) return undefined;
  Object.assign(cliente, limpiarDatos(datos));
  guardar();
  return cliente;
}

//funcion de eliminar cliente
export function eliminarCliente(id) {
  const index = clientes.findIndex((cliente) => cliente.id === Number(id));
  if (index === -1) return false;
  clientes.splice(index, 1);
  guardar();
  return true;
}


function guardar() {
  writeFileSync(RUTA_DATOS, JSON.stringify(clientes, null, 2)+'\n');
}

// revisar los datos del formulario
function limpiarDatos(datos) {

  const errores = [];
  const texto = (valor) => valor?.toString().trim() || null;
  const nombre = texto(datos.nombre);
  const email = texto(datos.email);
  const totalCompras = Number(datos.totalCompras ?? 0);

  if(!nombre) errores.push('El nombre es obligatorio');

  if(email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
    errores.push("el email no es valido");
  }

  if (!Number.isFinite(totalCompras) || totalCompras < 0) {
    errores.push('El total de compras debe ser un número mayor o igual a 0');
  }

  if(errores.length) throw new ErrorValidacion(errores);

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











