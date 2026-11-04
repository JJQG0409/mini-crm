const buscador = document.querySelector('#buscador');
const listaClientes = document.querySelector('#clientes');
const contador = document.querySelector('#contador');
const detalle = document.querySelector('#detalle');
const resumen = document.querySelector('#resumen');
const btnCrear = document.querySelector('#btn-crear');
const btnModificar = document.querySelector('#btn-modificar');
const btnEliminar = document.querySelector('#btn-eliminar');
const dialogo = document.querySelector('#dialogo-cliente');
const formulario = document.querySelector('#formulario');
const tituloFormulario = document.querySelector('#titulo-formulario');
const errorFormulario = document.querySelector('#errores-formulario');

const formatoMoneda = new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' });

// Con menos caracteres que estos se muestra la lista completa en lugar de buscar.
const MINIMO_PARA_BUSCAR = 2;
// Si no se indica un límite, la API devuelve 5 resultados; en la lista queremos verlos todos.
const LIMITE_RESULTADOS = 50;

let idSeleccionado = null;
let clienteActual = null;
let idEnEdicion = null;

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

function actualizarBotones() {
  btnModificar.disabled = btnEliminar.disabled = clienteActual === null;
}

async function mostrarDetalle(id) {
  idSeleccionado = id;
  const respuesta = await fetch(`/api/clientes/${id}`);
  detalle.innerHTML = '';

  if (!respuesta.ok) {
    clienteActual = null;
    actualizarBotones();
    const error = document.createElement('p');
    error.className = 'error';
    error.textContent = 'Cliente no encontrado';
    detalle.append(error);
    return;
  }

  const cliente = await respuesta.json();
  clienteActual = cliente;
  actualizarBotones();

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

function refrescar(){

  return Promise.all([
    cargarResumen(),
    cargarClientes(buscador.value)
  ]);
}

function abrirFormulario(cliente) {
  idEnEdicion = cliente?.id ?? null;
  tituloFormulario.textContent = cliente ? 'Modificar cliente' : 'Nuevo cliente';
  errorFormulario.textContent = '';
  formulario.reset();
  if(cliente){
    for(const campo of ['nombre', 'empresa', 'email', 'telefono', 'ciudad', 'totalCompras']){
      formulario[campo].value = cliente[campo] ?? '';
    }
    formulario.elements.activo.checked = cliente.activo;
  }
  dialogo.showModal();
  formulario.elements.nombre.focus();

}

async function guardarCliente(evento) {
  evento.preventDefault();
  const campos = formulario.elements;
  const datos = {
    nombre: campos.nombre.value,
    empresa: campos.empresa.value,
    email: campos.email.value,
    telefono: campos.telefono.value,
    ciudad: campos.ciudad.value,
    totalCompras: Number(campos.totalCompras.value),
    activo: campos.activo.checked
  };

  const editando = idEnEdicion !== null;
  const respuesta = await fetch(editando ? `/api/clientes/${idEnEdicion}` : '/api/clientes', {
    method: editando ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });
  const resultado = await respuesta.json();

  if (!respuesta.ok) {
    errorFormulario.textContent = resultado.error ?? 'Error con los datos';
    return;
  }

  dialogo.close();
  await refrescar();
  await mostrarDetalle(resultado.id);
}

async function eliminarCliente() {
  if(!clienteActual) return;
  if(!confirm(`¿Eliminar a ${clienteActual.nombre}?`)) return;

  const respuesta = await fetch(`/api/clientes/${clienteActual.id}`, { method: 'DELETE' });
  if(!respuesta.ok && respuesta.status !== 404) {
    alert('Error al eliminar el cliente');
    return;
  }

idSeleccionado = null;
clienteActual = null;
actualizarBotones();
detalle.innerHTML = '<p class="ayuda">Haz clic en un cliente de la lista para ver su detalle.</p>';
await refrescar();
}

btnCrear.addEventListener('click', () => abrirFormulario(null));
btnModificar.addEventListener('click', () => abrirFormulario(clienteActual));
btnEliminar.addEventListener('click', eliminarCliente);
formulario.addEventListener('submit', guardarCliente);
document.querySelector('#btn-cancelar').addEventListener('click', () => dialogo.close());

buscador.addEventListener('input', debounce((evento) => cargarClientes(evento.target.value), 300));

cargarResumen();
cargarClientes('');
