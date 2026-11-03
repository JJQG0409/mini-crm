const buscador = document.querySelector('#buscador');
const listaClientes = document.querySelector('#clientes');
const contador = document.querySelector('#contador');
const detalle = document.querySelector('#detalle');
const resumen = document.querySelector('#resumen');

const formatoMoneda = new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' });

// Con menos caracteres que estos se muestra la lista completa en lugar de buscar.
const MINIMO_PARA_BUSCAR = 2;
// Si no se indica un límite, la API devuelve 5 resultados; en la lista queremos verlos todos.
const LIMITE_RESULTADOS = 50;

let idSeleccionado = null;

// Retrasa la ejecución de `fn` hasta que pasen `espera` ms sin nuevas llamadas.
function debounce(fn, espera) {
  let temporizador;
  return (...args) => {
    clearTimeout(temporizador);
    temporizador = setTimeout(() => fn(...args), espera);
  };
}

async function cargarResumen() {
  const respuesta = await fetch('/api/resumen');
  const { totalClientes, activos, ventasTotales } = await respuesta.json();
  resumen.textContent =
    `${activos} de ${totalClientes} clientes activos · Ventas totales: ${formatoMoneda.format(ventasTotales)}`;
}

// Sin término muestra todos los clientes activos; con término, los resultados de la búsqueda.
async function cargarClientes(termino) {
  const buscando = termino.trim().length >= MINIMO_PARA_BUSCAR;
  const url = buscando
    ? `/api/clientes/buscar?q=${encodeURIComponent(termino)}&limite=${LIMITE_RESULTADOS}`
    : '/api/clientes';

  const respuesta = await fetch(url);
  const clientes = await respuesta.json();
  pintarClientes(clientes, buscando ? termino.trim() : '');
}

function pintarClientes(clientes, termino) {
  listaClientes.innerHTML = '';

  if (termino) {
    const palabra = clientes.length === 1 ? 'resultado' : 'resultados';
    contador.textContent = `${clientes.length} ${palabra} para "${termino}"`;
  } else {
    contador.textContent = `${clientes.length} clientes activos`;
  }

  if (clientes.length === 0) {
    const vacio = document.createElement('li');
    vacio.className = 'vacio';
    vacio.textContent = 'Ningún cliente coincide con la búsqueda.';
    listaClientes.append(vacio);
    return;
  }

  for (const cliente of clientes) {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.classList.toggle('seleccionado', cliente.id === idSeleccionado);

    const nombre = document.createElement('strong');
    nombre.textContent = cliente.nombre;
    const empresa = document.createElement('small');
    empresa.textContent = cliente.empresa ?? 'Sin empresa';
    boton.append(nombre, empresa);

    boton.addEventListener('click', () => {
      listaClientes.querySelector('.seleccionado')?.classList.remove('seleccionado');
      boton.classList.add('seleccionado');
      mostrarDetalle(cliente.id);
    });

    const item = document.createElement('li');
    item.append(boton);
    listaClientes.append(item);
  }
}

async function mostrarDetalle(id) {
  idSeleccionado = id;
  const respuesta = await fetch(`/api/clientes/${id}`);
  detalle.innerHTML = '';

  if (!respuesta.ok) {
    const error = document.createElement('p');
    error.className = 'error';
    error.textContent = 'Cliente no encontrado';
    detalle.append(error);
    return;
  }

  const cliente = await respuesta.json();

  const titulo = document.createElement('h2');
  titulo.textContent = cliente.nombre;

  const datos = document.createElement('dl');
  const campos = [
    ['Empresa', cliente.empresa],
    ['Email', cliente.email],
    ['Teléfono', cliente.telefono],
    ['Ciudad', cliente.ciudad],
    ['Cliente desde', cliente.fechaRegistro],
    ['Total de compras', formatoMoneda.format(cliente.totalCompras)],
    ['Estado', cliente.activo ? 'Activo' : 'Inactivo'],
  ];
  for (const [etiqueta, valor] of campos) {
    const dt = document.createElement('dt');
    dt.textContent = etiqueta;
    const dd = document.createElement('dd');
    dd.textContent = valor ?? '—';
    datos.append(dt, dd);
  }

  detalle.append(titulo, datos);
}

buscador.addEventListener('input', debounce((evento) => cargarClientes(evento.target.value), 300));

cargarResumen();
cargarClientes('');
