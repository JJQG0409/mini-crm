import { normalizarTexto } from './utils.js';

const LONGITUD_MINIMA = 2;
const LIMITE_POR_DEFECTO = 5;

/**
 * Busca los clientes que coinciden con lo que el usuario escribe en el buscador.
 *
 * - Ignora mayúsculas, tildes y espacios al inicio/final del término.
 * - Busca en nombre y empresa; cada palabra del término debe aparecer.
 * - Solo clientes activos.
 * - Primero los nombres que empiezan con el término; luego el resto,
 *   en orden alfabético.
 *
 * @param {Array<object>} clientes Lista completa de clientes.
 * @param {string} termino Texto que escribió el usuario.
 * @param {{ limite?: number }} [opciones]
 * @returns {Array<object>} Clientes que coinciden, en orden de relevancia.
 */
export function buscarClientes(clientes, termino, opciones = {}) {
  const { limite = LIMITE_POR_DEFECTO } = opciones;
  const busqueda = normalizarTexto(termino).trim();
  if (busqueda.length < LONGITUD_MINIMA) return [];

  const palabras = busqueda.split(/\s+/);
  const empiezaConBusqueda = (cliente) => normalizarTexto(cliente.nombre).startsWith(busqueda);

  return clientes
    .filter((cliente) => cliente.activo)
    .filter((cliente) => {
      const texto = `${normalizarTexto(cliente.nombre)} ${normalizarTexto(cliente.empresa)}`;
      return palabras.every((palabra) => texto.includes(palabra));
    })
    .sort((a, b) => {
      const prioridad = empiezaConBusqueda(b) - empiezaConBusqueda(a);
      return prioridad || a.nombre.localeCompare(b.nombre, 'es');
    })
    .slice(0, limite);
}
