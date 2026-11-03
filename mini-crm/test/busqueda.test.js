import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { buscarClientes } from '../src/busqueda.js';

const clientes = JSON.parse(readFileSync(new URL('../data/clientes.json', import.meta.url), 'utf-8'));
const ids = (resultados) => resultados.map((cliente) => cliente.id).sort((a, b) => a - b);

describe('buscarClientes', () => {
  it('devuelve [] si el término tiene menos de 2 caracteres', () => {
    assert.deepEqual(buscarClientes(clientes, ''), []);
    assert.deepEqual(buscarClientes(clientes, 'a'), []);
  });

  it('no distingue mayúsculas de minúsculas', () => {
    assert.ok(ids(buscarClientes(clientes, 'CARLOS')).includes(7));
  });

  it('ignora las tildes', () => {
    const resultado = ids(buscarClientes(clientes, 'perez'));
    assert.ok(resultado.includes(1), 'debería encontrar a "María José Pérez"');
    assert.ok(resultado.includes(14), 'debería encontrar a "Jorge Pérez"');
  });

  it('busca también por empresa', () => {
    assert.deepEqual(ids(buscarClientes(clientes, 'quetzal')), [1, 21]);
  });

  it('excluye a los clientes inactivos', () => {
    assert.deepEqual(buscarClientes(clientes, 'cifuentes'), []);
  });

  it('devuelve como máximo 5 resultados por defecto', () => {
    assert.equal(buscarClientes(clientes, 'ana').length, 5);
  });
});
