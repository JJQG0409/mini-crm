import {crearCliente, eliminarCliente} from './clientes.js';

const nuevo = crearCliente({nombre: 'Prueba',email: 'prueba@.com', totalCompras: '100' });
console.log(nuevo);
console.log(eliminarCliente(nuevo.id));