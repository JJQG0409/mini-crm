# Prueba técnica: Parte 2 (offline)

¡Gracias por participar en la sesión de live coding! En esta parte vas a agregar
una funcionalidad nueva al Mini CRM, con tu propio ritmo y tus propias herramientas.

## Contexto

Los vendedores llaman, escriben y visitan a los clientes, pero no queda registro
de esas interacciones. Necesitan **notas de seguimiento** por cliente.

## Lo que hay que construir

### Obligatorio

1. **Registrar una nota**: `POST /api/clientes/:id/notas`
   - Cuerpo JSON: `{ "tipo": "llamada" | "correo" | "reunion", "texto": "..." }`
   - `texto` es obligatorio (máximo 500 caracteres) y `tipo` debe ser uno de los tres permitidos.
   - El servidor asigna `id` y `fecha` (fecha y hora del registro).
   - Responde `201` con la nota creada, `400` si los datos no son válidos (con un mensaje que explique por qué) y `404` si el cliente no existe.
2. **Listar las notas de un cliente**: `GET /api/clientes/:id/notas`, de la más reciente a la más antigua.
3. **Persistencia**: las notas deben conservarse aunque se reinicie el servidor (por ejemplo, en un archivo JSON dentro de `data/`).
4. **Interfaz**: en el detalle del cliente, mostrar su historial de notas y un formulario para agregar una nueva.
5. **README actualizado**: cómo ejecutar el proyecto, qué construiste y por qué tomaste tus decisiones principales.

### Opcional (suma puntos)

- Pruebas automáticas de lo que construiste (con `node:test`, igual que las existentes).
- `GET /api/seguimiento/pendientes?dias=30`: clientes activos que no tienen ninguna nota en los últimos N días.
- Cualquier mejora que consideres valiosa; explícala en el README.

## Reglas

- **Sin dependencias externas**: solo Node.js y lo que trae incluido. Nada de `npm install`.
- **Puedes usar IA** (Copilot, ChatGPT, Claude, Cursor, lo que uses normalmente). Agrega al README una sección **"Uso de IA"** donde cuentes qué herramientas usaste, para qué, y qué corregiste o descartaste de lo que te propusieron. Ten en cuenta que más adelante te podemos pedir que expliques cualquier parte del código.
- Evaluaremos el resultado y también **la forma en que trabajaste**.

## Entrega

1. Publica tu solución en un **repositorio público de GitHub**.
2. Envía el enlace del repositorio a **obrian.hc@gmail.com** con el asunto:
   `Prueba técnica Parte 2 - Tu nombre completo`
3. Plazo: **72 horas** a partir de que recibes este archivo.

¡Éxitos!
