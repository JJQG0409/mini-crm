# Mini CRM

Mini CRM de una distribuidora: lista de clientes activos con buscador y detalle de cada cliente.

## Requisitos

- [Node.js](https://nodejs.org) 20 o superior.
- Sin dependencias externas: no hace falta `npm install`.

## Cómo ejecutarlo

```bash
npm start      # servidor en http://localhost:3000
npm run dev    # igual, pero se reinicia al guardar cambios
npm test       # pruebas automáticas
```

## Estructura

```
data/clientes.json   Datos de los clientes
src/server.js        Servidor HTTP y rutas de la API
src/clientes.js      Acceso a los datos de clientes
src/busqueda.js      Búsqueda de clientes (filtra la lista de la interfaz)
src/utils.js         Funciones de apoyo
public/              Interfaz web (HTML, CSS y JS del navegador)
test/                Pruebas automáticas (node:test)
```

## API

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/resumen` | Total de clientes, activos y ventas totales |
| GET | `/api/clientes` | Clientes activos (lista inicial de la interfaz) |
| GET | `/api/clientes/buscar?q=texto&limite=5` | Clientes que coinciden con el texto (5 si no se indica `limite`) |
| GET | `/api/clientes/:id` | Detalle de un cliente |


## Informe

en la segunda fase se me encomendo agregar mas funcionalidades al proyecto mini-crm, entonces opte por agregar las funcionalidades de crear cliente, modificar y eliminar. Se agregaron tres botones en el archivo index.html. 
en el archivo de clientes.js se agregaron las funciones crear cliente, actualizarcliente y eliminarCliente, estos guardan los cambios en el archivo json, ademas se agrego una funcion de limpoar datos  para validar lo que llega del formulario y se hizo una validacion de errores en caso de que hubieran.

en el achivo de servidor se agregaron rutas segun lo necesario, para agregar, modificar y eliminar, ademas que se agregaron los codigos de respuestas para validar la accion.

Durante el desarrollo se uso inteligencia artificial para distintos motivos como lo son: busqueda de errores, estos incluyen tanto de logica como de tipeo, y tambien para la optimizacion del codigo, para que este sea mas elegante y funcional.


