# ✅ Lista de Verificación de Funcionalidades

Usa esta lista para verificar que todas las funcionalidades de la aplicación están funcionando correctamente.

## 🔐 Autenticación y Usuarios

### Registro e Inicio de Sesión
- [ ] Puedo registrarme como nuevo usuario (Propietario)
- [ ] Puedo iniciar sesión con email y contraseña
- [ ] Veo un mensaje de error si el email/contraseña son incorrectos
- [ ] Puedo cerrar sesión correctamente
- [ ] Al iniciar sesión veo mi nombre y rol en el header

### Gestión de Usuarios (Solo Propietario)
- [ ] Puedo ver la lista de usuarios en la pestaña "Usuarios"
- [ ] Puedo crear un nuevo usuario Vendedor
- [ ] Puedo crear un nuevo usuario Administrador
- [ ] Puedo crear un nuevo usuario Propietario
- [ ] Puedo editar el rol de un usuario
- [ ] Puedo eliminar un usuario (excepto mi propia cuenta)
- [ ] El sistema me impide eliminar mi propia cuenta

### Control de Acceso por Roles
- [ ] Como Vendedor NO veo las pestañas "Finanzas", "Reportes" ni "Usuarios"
- [ ] Como Administrador veo "Finanzas" y "Reportes" pero NO "Usuarios"
- [ ] Como Propietario veo TODAS las pestañas

---

## 👥 Gestión de Clientes

### Ver Clientes
- [ ] Puedo ver la lista de todos los clientes
- [ ] Veo el contador de clientes registrados
- [ ] Puedo buscar clientes por nombre
- [ ] Puedo buscar clientes por teléfono
- [ ] Puedo buscar clientes por email

### Crear y Editar Clientes
- [ ] Puedo crear un nuevo cliente con nombre y teléfono
- [ ] Puedo agregar email y dirección opcionales
- [ ] El sistema me impide crear un cliente sin nombre o teléfono
- [ ] Puedo editar la información de un cliente existente
- [ ] Los cambios se guardan correctamente

### Detalle de Cliente
- [ ] Puedo ver el detalle completo de un cliente
- [ ] Veo el historial de pedidos del cliente
- [ ] Veo el total gastado por el cliente
- [ ] Veo el número total de pedidos del cliente

---

## 🎂 Gestión de Pedidos

### Ver Pedidos
- [ ] Puedo ver la lista de todos los pedidos
- [ ] Puedo filtrar pedidos por estado (Pendiente, En Producción, etc.)
- [ ] Los pedidos muestran nombre del cliente, fecha y precio
- [ ] Puedo ver el detalle completo de un pedido

### Crear Pedidos
- [ ] Puedo crear un nuevo pedido
- [ ] Puedo seleccionar un cliente de la lista
- [ ] Puedo ingresar fecha y hora de entrega
- [ ] Puedo escribir una descripción detallada del pastel
- [ ] Puedo subir una o múltiples imágenes de referencia
- [ ] Puedo ingresar el precio total
- [ ] Puedo ingresar el monto del anticipo
- [ ] El sistema calcula automáticamente el saldo pendiente
- [ ] Puedo seleccionar el estado del pedido
- [ ] Puedo seleccionar el estado de pago

### Editar Pedidos
- [ ] Puedo editar cualquier campo de un pedido existente
- [ ] Puedo agregar más imágenes a un pedido
- [ ] Puedo eliminar imágenes de un pedido
- [ ] Puedo cambiar el estado del pedido
- [ ] Puedo actualizar el estado de pago
- [ ] Los cambios se guardan correctamente

### Eliminar Pedidos
- [ ] Como Vendedor NO puedo eliminar pedidos
- [ ] Como Administrador o Propietario SÍ puedo eliminar pedidos
- [ ] El sistema me pide confirmación antes de eliminar
- [ ] El pedido se elimina correctamente

### Imágenes en Pedidos
- [ ] Las imágenes se suben correctamente
- [ ] Puedo ver las imágenes subidas en miniatura
- [ ] Puedo ver las imágenes en tamaño completo en el detalle
- [ ] Puedo subir múltiples imágenes (hasta 5MB cada una)
- [ ] Veo un mensaje de error si la imagen es muy grande

---

## 📅 Calendario

### Vistas del Calendario
- [ ] Puedo ver el calendario en vista mensual
- [ ] Puedo ver el calendario en vista semanal
- [ ] Puedo ver el calendario en vista diaria
- [ ] Puedo cambiar entre vistas fácilmente

### Navegación del Calendario
- [ ] Puedo navegar al mes/semana/día anterior
- [ ] Puedo navegar al mes/semana/día siguiente
- [ ] Puedo volver rápidamente a "Hoy"
- [ ] El día actual está resaltado

### Pedidos en Calendario
- [ ] Los pedidos aparecen en la fecha correcta
- [ ] Los pedidos muestran la hora de entrega
- [ ] Los pedidos están codificados por color según su estado
- [ ] Puedo filtrar los pedidos del calendario por estado
- [ ] Puedo hacer clic en un día para ver todos sus pedidos
- [ ] Puedo hacer clic en un pedido para ver su detalle

---

## 💰 Finanzas (Solo Admin y Propietario)

### Vista General
- [ ] Puedo ver el total de ingresos
- [ ] Puedo ver el total de egresos
- [ ] Puedo ver el balance (ingresos - egresos)
- [ ] Los totales se actualizan en tiempo real

### Registrar Transacciones
- [ ] Puedo registrar un nuevo ingreso
- [ ] Puedo registrar un nuevo egreso
- [ ] Puedo seleccionar la categoría apropiada
- [ ] Puedo ingresar el monto
- [ ] Puedo seleccionar la fecha
- [ ] Puedo agregar una descripción
- [ ] La transacción se guarda correctamente

### Gestionar Transacciones
- [ ] Puedo ver todas mis transacciones
- [ ] Puedo filtrar por tipo (Ingreso/Egreso)
- [ ] Las transacciones más recientes aparecen primero
- [ ] Puedo eliminar una transacción
- [ ] El sistema pide confirmación antes de eliminar

### Categorías
- [ ] Las categorías de egresos incluyen: Materia Prima, Servicios, Marketing, etc.
- [ ] Las categorías de ingresos incluyen: Venta Mostrador, Venta Extra, etc.
- [ ] Puedo seleccionar "Otros" si no encuentro la categoría

---

## 📊 Reportes (Solo Admin y Propietario)

### Generar Reportes
- [ ] Puedo seleccionar un rango de fechas personalizado
- [ ] Puedo usar el botón "Última Semana" para reporte semanal
- [ ] Puedo usar el botón "Este Mes" para reporte mensual
- [ ] Puedo usar el botón "Este Año" para reporte anual
- [ ] El reporte se genera correctamente

### Estadísticas de Pedidos
- [ ] Veo el total de pedidos en el período
- [ ] Veo las ventas totales
- [ ] Veo el total de anticipos recibidos
- [ ] Veo el saldo pendiente total
- [ ] Veo un gráfico circular de pedidos por estado

### Estadísticas Financieras
- [ ] Veo los ingresos totales (ventas + otros ingresos)
- [ ] Veo las ventas de pedidos separadas
- [ ] Veo otros ingresos separados
- [ ] Veo los egresos totales
- [ ] Veo los egresos desglosados por categoría
- [ ] Veo la ganancia neta calculada correctamente
- [ ] Veo gráficos de barras o porcentajes por categoría

### Funcionalidad de Exportación
- [ ] Veo el botón "Exportar" en los reportes
- [ ] (Nota: La exportación muestra mensaje "en desarrollo")

---

## 📱 Responsive y UX

### Diseño Móvil
- [ ] La aplicación se ve bien en mi teléfono móvil
- [ ] Puedo navegar fácilmente entre pestañas en móvil
- [ ] Los formularios son fáciles de completar en móvil
- [ ] Las tablas se pueden desplazar horizontalmente en móvil
- [ ] Los botones son fáciles de presionar en móvil

### Diseño Tablet
- [ ] La aplicación se ve bien en tablet
- [ ] Aprovecha el espacio adicional de la pantalla
- [ ] La navegación es cómoda

### Diseño Desktop
- [ ] La aplicación se ve bien en computadora
- [ ] Las vistas multi-columna funcionan correctamente
- [ ] Los diálogos están centrados
- [ ] El calendario es fácil de leer

### Feedback Visual
- [ ] Veo mensajes de éxito cuando creo/edito algo
- [ ] Veo mensajes de error si algo falla
- [ ] Los botones muestran estado de "cargando" durante operaciones
- [ ] Los formularios se deshabilitan mientras guardan
- [ ] Las notificaciones (toast) desaparecen automáticamente

---

## 🔍 Casos de Prueba Completos

### Flujo Completo: Nuevo Cliente y Pedido
1. [ ] Crear un nuevo cliente
2. [ ] Verificar que aparece en la lista
3. [ ] Crear un pedido para ese cliente
4. [ ] Subir 2-3 imágenes de referencia
5. [ ] Verificar que el pedido aparece en la lista
6. [ ] Verificar que el pedido aparece en el calendario
7. [ ] Abrir el detalle del cliente
8. [ ] Verificar que el pedido aparece en el historial

### Flujo Completo: Seguimiento de Pedido
1. [ ] Buscar un pedido "Pendiente"
2. [ ] Cambiar estado a "En Producción"
3. [ ] Verificar que el calendario refleja el cambio de color
4. [ ] Cambiar estado a "Listo"
5. [ ] Cambiar estado a "Entregado"
6. [ ] Actualizar estado de pago a "Pagado"
7. [ ] Verificar que todos los cambios se guardaron

### Flujo Completo: Gestión Financiera (Admin/Propietario)
1. [ ] Registrar un egreso de "Materia Prima"
2. [ ] Verificar que el balance se actualiza
3. [ ] Registrar un ingreso de "Venta Mostrador"
4. [ ] Verificar que el balance se actualiza
5. [ ] Filtrar solo egresos
6. [ ] Filtrar solo ingresos
7. [ ] Ver todas las transacciones

### Flujo Completo: Reportes (Admin/Propietario)
1. [ ] Generar reporte del mes actual
2. [ ] Verificar que muestra pedidos correctos
3. [ ] Verificar que calcula ventas correctamente
4. [ ] Verificar que muestra egresos por categoría
5. [ ] Verificar que calcula ganancia neta
6. [ ] Cambiar a reporte de la semana pasada
7. [ ] Verificar que los datos cambian

### Flujo Completo: Gestión de Equipo (Propietario)
1. [ ] Crear un usuario con rol "Vendedor"
2. [ ] Cerrar sesión
3. [ ] Iniciar sesión como el vendedor
4. [ ] Verificar que NO veo "Finanzas" ni "Reportes"
5. [ ] Crear un pedido como vendedor
6. [ ] Intentar eliminar un pedido (debería fallar)
7. [ ] Cerrar sesión
8. [ ] Iniciar sesión como propietario
9. [ ] Cambiar el vendedor a "Administrador"
10. [ ] Cerrar sesión
11. [ ] Iniciar sesión como administrador
12. [ ] Verificar que AHORA SÍ veo "Finanzas" y "Reportes"
13. [ ] Eliminar un pedido (debería funcionar)

---

## 🐛 Verificación de Errores Comunes

### Validaciones
- [ ] No puedo crear un cliente sin nombre
- [ ] No puedo crear un cliente sin teléfono
- [ ] No puedo crear un pedido sin cliente
- [ ] No puedo crear un pedido sin fecha de entrega
- [ ] No puedo crear un pedido sin descripción
- [ ] No puedo crear un pedido sin precio
- [ ] No puedo registrar una transacción sin categoría
- [ ] No puedo registrar una transacción sin monto
- [ ] No puedo crear un usuario sin email
- [ ] No puedo crear un usuario sin contraseña (mínimo 6 caracteres)

### Seguridad
- [ ] No puedo acceder a la app sin iniciar sesión
- [ ] Mi sesión se mantiene si recargo la página
- [ ] Puedo cerrar sesión correctamente
- [ ] No puedo acceder a endpoints sin autenticación
- [ ] Los vendedores no pueden acceder a finanzas
- [ ] Solo administradores y propietarios pueden eliminar pedidos
- [ ] Solo propietarios pueden gestionar usuarios

---

## ✨ Extras y Detalles

### Usabilidad
- [ ] Los íconos son claros y comprensibles
- [ ] Los colores son agradables y consistentes
- [ ] La tipografía es legible
- [ ] Los formularios tienen labels claros
- [ ] Los botones indican claramente su función
- [ ] Los estados de carga son visibles

### Performance
- [ ] La aplicación carga rápidamente
- [ ] Las imágenes se cargan sin demora excesiva
- [ ] Los filtros responden inmediatamente
- [ ] La búsqueda es rápida

### Datos
- [ ] Los datos persisten después de recargar
- [ ] Las imágenes permanecen disponibles
- [ ] Las transacciones se registran correctamente
- [ ] Los reportes calculan correctamente

---

## 📝 Notas de Testing

**Fecha de prueba:** _______________

**Versión:** 1.0.0

**Testeado por:** _______________

**Navegador:** _______________

**Dispositivo:** _______________

**Problemas encontrados:**
- 
- 
- 

**Sugerencias de mejora:**
- 
- 
- 

---

## 🎯 Criterios de Éxito

Para considerar la aplicación lista para uso:

- [ ] Al menos 95% de las funcionalidades básicas funcionan
- [ ] Todos los roles tienen el acceso correcto
- [ ] No hay errores críticos que bloqueen el uso
- [ ] La aplicación es usable en móvil, tablet y desktop
- [ ] Los datos se guardan correctamente
- [ ] Las imágenes se cargan y muestran bien

**Estado final:** 
- ✅ APROBADO / ❌ REQUIERE CORRECCIONES

**Comentarios finales:**
_______________________________________________
_______________________________________________
_______________________________________________
