# 🎂 Formulario Público de Pedidos

## ¿Qué es?

El formulario público de pedidos es una nueva funcionalidad que permite a tus clientes hacer pedidos directamente sin necesidad de registro o autenticación.

## ¿Cómo Acceder?

### Opción 1: Desde el Dashboard
1. Inicia sesión en tu aplicación
2. En la parte superior derecha, verás un botón **"Link de Pedidos"** (con ícono de compartir)
3. Haz clic en el botón
4. Se abrirá un diálogo con opciones para:
   - **Copiar el link** - Para enviarlo manualmente
   - **Ver Formulario** - Abre el formulario en una nueva pestaña
   - **Compartir por WhatsApp** - Comparte directamente con mensaje predefinido

### Opción 2: URL Directa
Simplemente navega a: **`tu-url/pedido`**

Por ejemplo:
- `https://tu-aplicacion.com/pedido`
- `http://localhost:5173/pedido` (en desarrollo)

## Características del Formulario

### 📋 Datos del Cliente
- **Nombre** (obligatorio)
- **Apellido** (opcional)
- **Teléfono/WhatsApp** (obligatorio)

### 🎨 Selección de Pastel

#### Tipo de Cobertura
Selector visual interactivo con 3 opciones:
- **Turrón** - Base de claras de huevo
- **Betún** - Crema mantequilla  
- **Fondant** - Cobertura suave y lisa

Cada opción muestra una imagen real para facilitar la elección.

#### Tamaño
- Selector de botones con opciones predefinidas: 5, 10, 15, 20, 25, 30, 40, 50, 70, 100, 200 personas
- Campo de texto libre para tamaños personalizados (ej: "35 personas", "1/2 libra")

### 🍰 Detalles del Pastel
- **Decoración Deseada** - Texto libre (ej: "Flores", "Unicornio", "Superhéroes")
- **Color Principal** - Texto libre
- **Sabor** - Texto libre  
- **Notas Adicionales** - Campo de texto largo para cualquier detalle especial

### 📸 Fotos de Referencia
- Permite subir hasta **5 imágenes**
- Las imágenes se almacenan automáticamente en Supabase Storage
- Vista previa de las imágenes antes de enviar
- Opción para eliminar imágenes individuales

### 📅 Fecha y Hora de Entrega
- Selector de calendario visual
- Campo de hora (formato 24h)
- Validación para evitar fechas pasadas

## Flujo del Pedido

### 1. Cliente Completa el Formulario
- Llena todos los campos obligatorios
- Sube fotos de referencia (opcional)
- Hace clic en **"Enviar Pedido por WhatsApp"**

### 2. Auto-Creación de Cliente
El sistema automáticamente:
- Busca si existe un cliente con ese teléfono
- Si existe, usa ese cliente
- Si NO existe, crea un nuevo cliente con:
  - Nombre completo
  - Teléfono
  - Marcador especial `source: 'public_form'`

### 3. Creación del Pedido
El pedido se crea con:
- **Estado Especial**: `pendiente_confirmacion` 
- **Descripción Completa**: Incluye todos los detalles del pastel
- **Imágenes**: URLs de las fotos de referencia
- **Precio**: $0 (para que el propietario lo complete)
- **Datos Adicionales**: Objeto `publicOrderData` con toda la información estructurada

### 4. Confirmación al Cliente
- Pantalla de éxito con mensaje de confirmación
- Se abre WhatsApp automáticamente con un mensaje predefinido que incluye:
  - Todos los detalles del pedido
  - Confirmación de registro en el sistema
- Opción para hacer otro pedido

### 5. Gestión en el Dashboard

#### Vista en Lista de Pedidos
Los pedidos públicos se identifican con:
- **Badge Especial**: "🎂 Pedido Público" (color púrpura animado)
- **Estado**: "Pendiente Confirmación"
- Aparecen en la pestaña **"Pedidos del Mes"**

#### Acciones del Propietario
Solo el **propietario** puede:
1. Editar el pedido
2. Agregar el **precio total**
3. Cambiar el estado a:
   - `pendiente` - Una vez confirmado el precio
   - `en_produccion` - Cuando se empiece a hacer
   - `listo` - Cuando esté terminado
   - `entregado` - Cuando se entregue al cliente
   - `cancelado` - Si se cancela

## Ventajas

### Para el Cliente
✅ **Sin registro** - No necesita crear cuenta  
✅ **Rápido** - Solo llena un formulario simple  
✅ **Visual** - Ve imágenes de los tipos de pastel  
✅ **Fotos** - Puede compartir referencias fácilmente  
✅ **WhatsApp** - Confirmación instantánea por su canal preferido

### Para Ti (Propietario)
✅ **Automático** - Clientes y pedidos se crean solos  
✅ **Organizado** - Todo queda registrado en el sistema  
✅ **Visible** - Pedidos públicos claramente marcados  
✅ **Flexible** - Tú defines el precio final  
✅ **Compartible** - Un solo link para todos tus clientes  
✅ **WhatsApp Ready** - Integración perfecta con tu flujo de trabajo

## Compartir el Link

### Método 1: Botón de Dashboard
1. Click en **"Link de Pedidos"** en el header
2. Click en **"Compartir por WhatsApp"**
3. ¡Listo! Se abre WhatsApp con mensaje predefinido

### Método 2: Manual
Copia el link y compártelo por:
- WhatsApp Business (como mensaje de bienvenida)
- Instagram (link en bio)
- Facebook (publicaciones, stories)
- Tu página web
- Tarjetas de presentación (código QR)

### Método 3: QR Code
Puedes generar un código QR del link y:
- Imprimirlo en tarjetas
- Ponerlo en tu local
- Incluirlo en empaques

## Mensaje Sugerido para Compartir

```
¡Hola! 🎂

Ahora puedes hacer tu pedido de pastel directamente desde este enlace:

[TU-URL]/pedido

Es rápido, fácil y seguro. ¡Esperamos tu pedido! 🍰
```

## Preguntas Frecuentes

### ¿El cliente necesita registrarse?
❌ No. El formulario es completamente público y no requiere autenticación.

### ¿Se pueden duplicar clientes?
✅ No. El sistema verifica por teléfono antes de crear un cliente nuevo.

### ¿Quién puede ver estos pedidos?
👀 Todos los roles (vendedor, administrador, propietario) pueden VER los pedidos.  
✏️ Solo el **propietario** puede EDITAR y confirmar precios.

### ¿Qué pasa si no ponen precio de entrega?
🔒 El pedido se crea con precio $0. El propietario debe editarlo y agregar el precio.

### ¿Las imágenes ocupan mucho espacio?
📦 Las imágenes se almacenan en Supabase Storage con límite de 5MB por imagen.

### ¿Puedo personalizar el formulario?
✅ Sí, puedes editar `/components/PublicOrderForm.tsx` para agregar/quitar campos.

### ¿Funciona en móvil?
📱 100% responsive. Diseñado mobile-first para perfecta experiencia en celulares.

## Soporte Técnico

Si tienes problemas:

1. **Verifica la URL**: Asegúrate de que termina en `/pedido`
2. **Abre la consola**: Press F12 y busca errores
3. **Prueba en incógnito**: Para descartar problemas de caché
4. **Verifica el backend**: El endpoint `/make-server-95aa99a4/public-order` debe estar funcionando

## Próximas Mejoras

Ideas para el futuro:
- [ ] QR code integrado en el diálogo de compartir
- [ ] Plantillas de mensajes personalizables
- [ ] Notificaciones push cuando llega pedido público
- [ ] Analytics de cuántos pedidos vienen del formulario público
- [ ] Opción de pre-cotización automática basada en tipo y tamaño
