# Guía de Configuración Inicial

## 🎯 Configuración Rápida

### Paso 1: Crear tu Cuenta de Propietario

1. Abre la aplicación en tu navegador
2. Verás la pantalla de inicio con dos pestañas: "Iniciar Sesión" y "Registrarse"
3. Haz clic en la pestaña **"Registrarse"**
4. Completa el formulario:
   - **Nombre Completo**: Tu nombre
   - **Correo Electrónico**: Un email válido
   - **Contraseña**: Mínimo 6 caracteres
   - **Confirmar Contraseña**: Repite la contraseña
5. Haz clic en **"Crear Cuenta"**
6. Automáticamente iniciarás sesión con rol de **Propietario**

### Paso 2: Familiarízate con el Dashboard

Después de iniciar sesión, verás 6 pestañas principales:

1. **Pedidos** 🛍️
   - Vista y gestión de todos los pedidos
   - Crear nuevos pedidos
   - Filtrar por estado

2. **Calendario** 📅
   - Vista mensual, semanal o diaria
   - Pedidos organizados por fecha de entrega
   - Filtros por estado

3. **Clientes** 👥
   - Lista de todos tus clientes
   - Búsqueda rápida
   - Historial de pedidos por cliente

4. **Finanzas** 💰 (Solo Admin y Propietario)
   - Registro de ingresos y egresos
   - Balance en tiempo real
   - Categorización de transacciones

5. **Reportes** 📊 (Solo Admin y Propietario)
   - Estadísticas de ventas
   - Análisis financiero
   - Gráficos y resúmenes

6. **Usuarios** 👤 (Solo Propietario)
   - Gestión del equipo
   - Asignación de roles
   - Crear/editar/eliminar usuarios

## 📝 Crear tu Primer Cliente

1. Ve a la pestaña **"Clientes"**
2. Haz clic en el botón **"+ Nuevo"**
3. Completa el formulario:
   - **Nombre Completo** * (obligatorio)
   - **Teléfono** * (obligatorio)
   - **Correo Electrónico** (opcional)
   - **Dirección** (opcional)
4. Haz clic en **"Crear Cliente"**

### Ejemplo de Cliente:
```
Nombre: María García
Teléfono: +52 555 123 4567
Email: maria.garcia@email.com
Dirección: Av. Principal 123, Col. Centro
```

## 🎂 Crear tu Primer Pedido

1. Asegúrate de tener al menos un cliente registrado
2. Ve a la pestaña **"Pedidos"**
3. Haz clic en **"+ Nuevo Pedido"**
4. Completa el formulario:

### Campos Obligatorios:
- **Cliente**: Selecciona de la lista
- **Fecha de Entrega**: Ejemplo: 2025-11-15
- **Hora**: Ejemplo: 15:00
- **Descripción del Pastel**: Ejemplo:
  ```
  Pastel de 3 pisos
  Sabor: Chocolate con frambuesa
  Relleno: Crema pastelera
  Cobertura: Fondant blanco
  Decoraciones: Flores rosas comestibles, listón dorado
  Tamaño: 30 personas
  ```
- **Precio Total**: Ejemplo: 1200.00

### Campos Opcionales:
- **Imágenes de Referencia**: Sube fotos del diseño deseado
- **Anticipo**: Monto pagado por adelantado (Ejemplo: 500.00)
- **Estado**: Pendiente (por defecto)
- **Estado de Pago**: Pendiente (por defecto)

5. Haz clic en **"Crear Pedido"**

## 💵 Registrar Transacciones Financieras

### Registrar un Egreso (Gasto):

1. Ve a la pestaña **"Finanzas"**
2. Haz clic en **"+ Nueva"**
3. Completa:
   - **Tipo**: Egreso
   - **Categoría**: Ejemplo: "Materia Prima"
   - **Monto**: Ejemplo: 250.00
   - **Fecha**: Fecha del gasto
   - **Descripción**: Ejemplo: "Compra de harina, azúcar y mantequilla"
4. Haz clic en **"Guardar"**

### Registrar un Ingreso Adicional:

1. Mismo proceso pero selecciona **Tipo: Ingreso**
2. **Categoría**: Ejemplo: "Venta Mostrador"
3. **Descripción**: Ejemplo: "Venta de cupcakes y galletas"

## 👥 Agregar Usuarios al Equipo

### Para Vendedores:

1. Ve a la pestaña **"Usuarios"**
2. Haz clic en **"+ Nuevo Usuario"**
3. Completa:
   ```
   Nombre: Juan Pérez
   Email: juan.perez@pasteleria.com
   Contraseña: segura123
   Rol: Vendedor
   ```
4. Haz clic en **"Crear Usuario"**

**Permisos del Vendedor:**
- ✅ Ver y gestionar pedidos
- ✅ Ver y gestionar clientes
- ✅ Ver calendario
- ❌ No puede ver finanzas
- ❌ No puede ver reportes
- ❌ No puede gestionar usuarios

### Para Administradores:

Mismo proceso pero selecciona **Rol: Administrador**

**Permisos del Administrador:**
- ✅ Todo lo del Vendedor
- ✅ Ver y gestionar finanzas
- ✅ Ver reportes
- ❌ No puede gestionar usuarios

### Para Propietarios:

Solo el propietario actual puede crear otro propietario.
Selecciona **Rol: Propietario** para acceso completo.

## 📊 Generar tu Primer Reporte

1. Ve a la pestaña **"Reportes"**
2. Selecciona el rango de fechas:
   - Usa los botones rápidos: "Última Semana", "Este Mes", "Este Año"
   - O selecciona fechas personalizadas
3. Haz clic en **"Generar"**

El reporte mostrará:
- 📦 Total de pedidos
- 💰 Ventas totales
- 📉 Gastos totales
- 📈 Ganancia neta
- 📊 Gráficos de pedidos por estado
- 📊 Egresos por categoría

## 🎨 Consejos de Uso

### Para Trabajo Diario:
1. **Por la Mañana**: Revisa el calendario del día
2. **Durante el Día**: Actualiza estados de pedidos según avances
3. **Al Recibir Pagos**: Actualiza el estado de pago de los pedidos
4. **Al Realizar Compras**: Registra los egresos inmediatamente
5. **Al Final del Día**: Verifica pedidos listos para el día siguiente

### Para Fin de Mes:
1. Genera un reporte mensual
2. Revisa la ganancia neta
3. Analiza qué categorías de gastos son más altas
4. Identifica tendencias en pedidos

### Buenas Prácticas:
- ✅ Siempre sube imágenes de referencia de los pedidos
- ✅ Registra todos los gastos, incluso los pequeños
- ✅ Actualiza el estado de los pedidos en tiempo real
- ✅ Mantén la información de contacto de clientes actualizada
- ✅ Registra anticipos para tener control del flujo de efectivo
- ✅ Usa descripciones detalladas en los pedidos

## 🔄 Flujo Completo de un Pedido

1. **Cliente llama o visita** → Crear/buscar cliente en el sistema
2. **Toma de pedido** → Crear pedido con todos los detalles + imágenes
3. **Recibe anticipo** → Actualizar monto de anticipo en el pedido
4. **Comienza producción** → Cambiar estado a "En Producción"
5. **Termina el pastel** → Cambiar estado a "Listo"
6. **Entrega el pedido** → Cambiar estado a "Entregado"
7. **Recibe pago final** → Actualizar estado de pago a "Pagado"

## ❓ Problemas Comunes

### No puedo ver la pestaña de Finanzas
- **Causa**: Tu usuario es Vendedor
- **Solución**: Pídele al Propietario que cambie tu rol a Administrador

### No puedo eliminar un pedido
- **Causa**: Solo Administradores y Propietarios pueden eliminar
- **Solución**: Contacta a un administrador o cambia el estado a "Cancelado"

### Las imágenes no se suben
- **Causa**: Archivo muy grande (máximo 5MB)
- **Solución**: Reduce el tamaño de la imagen antes de subirla

### Olvidé mi contraseña
- **Causa**: No hay función de recuperación en esta versión
- **Solución**: Pídele al Propietario que cree una nueva cuenta para ti

## 🚀 ¡Listo!

Ya tienes todo configurado para comenzar a usar tu sistema de gestión de pastelería.

**Recuerda**: Esta es una versión de prototipo. Para uso en producción, considera implementar:
- Sistema de respaldo automático
- Recuperación de contraseña
- Notificaciones por email/SMS
- Integración con sistema de pagos
- Exportación de reportes a PDF/Excel
