/**
 * Prepara un texto para compararlo: lo pasa a minúsculas y le quita las tildes.
 * Si recibe `null` o `undefined` devuelve un texto vacío.
 *
 * @example
 * normalizarTexto('María José'); // 'maria jose'
 *
 * @param {string | null | undefined} texto
 * @returns {string}
 */
export function normalizarTexto(texto) {
  return (texto ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}
