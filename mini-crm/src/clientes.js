import { readFileSync } from 'node:fs';

const RUTA_DATOS = new URL('../data/clientes.json', import.meta.url);

const clientes = JSON.parse(readFileSync(RUTA_DATOS, 'utf-8'));

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
