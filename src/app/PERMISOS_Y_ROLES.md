# Sistema de Roles y Permisos

## 🔐 Estructura de Roles

El sistema cuenta con 3 niveles jerárquicos de acceso:

```
PROPIETARIO (Nivel 3)
    ↓ tiene todos los permisos de
ADMINISTRADOR (Nivel 2)
    ↓ tiene todos los permisos de
VENDEDOR (Nivel 1)
```

---

## 👤 Rol: VENDEDOR (Nivel 1)

### ✅ Permisos Concedidos

#### Gestión de Clientes
- ✅ Ver lista completa de clientes
- ✅ Buscar clientes por nombre, teléfono o email
- ✅ Crear nuevos clientes
- ✅ Editar información de clientes existentes
- ✅ Ver historial de pedidos por cliente
- ✅ Ver estadísticas de compras por cliente

#### Gestión de Pedidos
- ✅ Ver lista completa de pedidos
- ✅ Filtrar pedidos por estado
- ✅ Crear nuevos pedidos
- ✅ Editar pedidos existentes
- ✅ Actualizar estado del pedido
- ✅ Actualizar estado de pago
- ✅ Subir imágenes de referencia
- ✅ Ver detalles completos de cada pedido

#### Calendario
- ✅ Ver calendario mensual, semanal y diario
- ✅ Ver pedidos organizados por fecha
- ✅ Filtrar pedidos en calendario por estado
- ✅ Cambiar entre vistas (mes/semana/día)

### ❌ Permisos Denegados

- ❌ Eliminar pedidos
- ❌ Acceder a módulo de Finanzas
- ❌ Registrar ingresos/egresos
- ❌ Ver balance financiero
- ❌ Acceder a módulo de Reportes
- ❌ Ver estadísticas financieras
- ❌ Gestionar usuarios
- ❌ Crear/editar/eliminar otros usuarios

### 📱 Interfaz para Vendedor

Pestañas visibles:
1. 🛍️ Pedidos
2. 📅 Calendario
3. 👥 Clientes

---

## 👨‍💼 Rol: ADMINISTRADOR (Nivel 2)

### ✅ Permisos Concedidos

#### Hereda TODO del Vendedor, más:

#### Gestión Financiera
- ✅ Ver módulo de Finanzas
- ✅ Ver balance (ingresos/egresos/balance)
- ✅ Registrar ingresos adicionales
- ✅ Registrar egresos/gastos
- ✅ Categorizar transacciones
- ✅ Filtrar transacciones por tipo
- ✅ Eliminar transacciones

#### Reportes y Análisis
- ✅ Ver módulo de Reportes
- ✅ Generar reportes por período
- ✅ Ver estadísticas de pedidos
- ✅ Ver análisis financiero
- ✅ Ver gráficos de rendimiento
- ✅ Ver egresos por categoría
- ✅ Calcular ganancia neta

#### Gestión de Pedidos Ampliada
- ✅ Eliminar pedidos

#### Gestión de Usuarios (Limitada)
- ✅ Ver módulo de Usuarios ⭐ (nuevo)
- ✅ Ver lista de usuarios
- ✅ Crear usuarios Vendedor y Administrador
- ✅ Editar roles (solo Vendedor ↔ Administrador)
- ✅ Eliminar usuarios Vendedor y Administrador
- ✅ Cambiar PIN del vendedor compartido ⭐ (nuevo)

### ❌ Permisos Denegados

- ❌ Crear usuarios con rol Propietario
- ❌ Editar usuarios Propietarios
- ❌ Eliminar usuarios Propietarios
- ❌ Cambiar rol a Propietario

### 📱 Interfaz para Administrador

Pestañas visibles:
1. 🛍️ Pedidos
2. 📅 Calendario
3. 👥 Clientes
4. 💰 Finanzas
5. 📊 Reportes
6. 👤 Usuarios ⭐ (nuevo - con permisos limitados)

---

## 👑 Rol: PROPIETARIO (Nivel 3)

### ✅ Permisos Concedidos

#### Hereda TODO del Administrador, más:

#### Gestión de Usuarios (Acceso Completo)
- ✅ Ver módulo de Usuarios
- ✅ Ver lista completa de usuarios
- ✅ Crear nuevos usuarios (cualquier rol, incluyendo Propietario)
- ✅ Editar información de usuarios
- ✅ Cambiar roles de usuarios (sin restricciones)
- ✅ Eliminar usuarios (incluyendo Administradores)
- ✅ Ver estadísticas de usuarios
- ✅ Cambiar PIN del vendedor compartido

### 🚫 Restricciones Especiales

- 🚫 No puede eliminar su propia cuenta
- 🚫 No puede degradar su propio rol

### 📱 Interfaz para Propietario

Pestañas visibles (TODAS):
1. 🛍️ Pedidos
2. 📅 Calendario
3. 👥 Clientes
4. 💰 Finanzas
5. 📊 Reportes
6. 👤 Usuarios ⭐ (exclusivo)

---

## 🔒 Seguridad a Nivel Backend

### Validación en Servidor

Todas las rutas del servidor validan:

1. **Autenticación**: Token JWT válido
2. **Autorización**: Rol apropiado para la acción
3. **Propiedad**: El usuario tiene derecho a acceder/modificar ese recurso

### Rutas Protegidas por Rol

#### Rutas Públicas (sin autenticación)
- `POST /signup` - Registro de nuevos usuarios
- `GET /health` - Verificación del servidor

#### Rutas Autenticadas (cualquier rol)
- `GET /profile` - Obtener perfil del usuario
- `GET /customers` - Listar clientes
- `POST /customers` - Crear cliente
- `PUT /customers/:id` - Editar cliente
- `GET /customers/:id` - Ver detalle de cliente
- `GET /orders` - Listar pedidos
- `POST /orders` - Crear pedido
- `PUT /orders/:id` - Editar pedido
- `GET /orders/:id` - Ver detalle de pedido
- `POST /upload-image` - Subir imágenes

#### Rutas de Administrador+ (Admin y Propietario)
- `DELETE /orders/:id` - Eliminar pedido
- `GET /transactions` - Listar transacciones
- `POST /transactions` - Crear transacción
- `DELETE /transactions/:id` - Eliminar transacción
- `GET /reports` - Generar reportes
- `GET /users` - Listar usuarios ⭐ (actualizado)
- `POST /users` - Crear usuario Vendedor/Admin (vía signup) ⭐ (actualizado)
- `PUT /users/:id` - Editar rol de usuario (con restricciones) ⭐ (actualizado)
- `DELETE /users/:id` - Eliminar usuario (excepto Propietarios) ⭐ (actualizado)
- `PUT /update-vendedor-pin` - Cambiar PIN del vendedor ⭐ (nuevo)

#### Rutas Exclusivas de Propietario
- `POST /users` - Crear usuario Propietario (vía signup)
- `PUT /users/:id` - Editar cualquier usuario (sin restricciones)
- `DELETE /users/:id` - Eliminar cualquier usuario (incluyendo Administradores)

---

## 🎯 Casos de Uso por Rol

### Vendedor - Día Típico

```
8:00 AM  - Llega un cliente sin cita
         → Busca al cliente en el sistema
         → Si no existe, lo crea
         → Crea el pedido con todos los detalles
         → Registra el anticipo

10:00 AM - Cliente llama para modificar su pedido
         → Busca el pedido
         → Edita la descripción
         → Actualiza información

2:00 PM  - Termina un pastel
         → Encuentra el pedido en el calendario
         → Cambia estado a "Listo"

5:00 PM  - Entrega un pedido
         → Marca como "Entregado"
         → Actualiza estado de pago si recibe el resto
```

### Administrador - Fin de Semana

```
Lunes   - Revisa calendario de la semana
        → Planifica producción según pedidos
        
Martes  - Compra materia prima
        → Registra egresos de compras
        
Viernes - Cliente paga sin pedido previo
        → Registra ingreso de "Venta Mostrador"
        
Domingo - Genera reporte semanal
        → Analiza ventas vs gastos
        → Identifica categorías de mayor gasto
        → Planifica compras para la semana siguiente
```

### Propietario - Gestión del Negocio

```
Mensual:
- Genera reporte del mes completo
- Analiza rentabilidad
- Revisa desempeño del equipo
- Ajusta precios si es necesario

Trimestral:
- Contrata nuevo personal
- Crea cuenta de vendedor
- Capacita al nuevo empleado

Anual:
- Revisa reportes anuales
- Planifica crecimiento
- Decide inversiones
- Evalúa equipo
- Ajusta roles según desempeño
```

---

## 🔐 Mejores Prácticas de Seguridad

### Para Propietarios

✅ **HACER:**
- Crear cuentas individuales para cada empleado
- Asignar el rol mínimo necesario
- Cambiar contraseñas periódicamente
- Eliminar cuentas de ex-empleados inmediatamente
- Revisar logs de actividad regularmente

❌ **NO HACER:**
- Compartir tu cuenta de Propietario
- Dar rol de Administrador a vendedores sin supervisión
- Usar contraseñas obvias
- Dejar sesiones abiertas en computadoras compartidas

### Para Administradores

✅ **HACER:**
- Cerrar sesión al terminar el turno
- Verificar montos antes de registrar transacciones
- Registrar gastos inmediatamente
- Mantener respaldos de información crítica

❌ **NO HACER:**
- Compartir credenciales con vendedores
- Dejar computadora sin bloquear
- Modificar reportes manualmente

### Para Vendedores

✅ **HACER:**
- Registrar todos los pedidos en el sistema
- Actualizar estados en tiempo real
- Solicitar ayuda de admin para funciones restringidas
- Cerrar sesión al terminar

❌ **NO HACER:**
- Intentar acceder a áreas restringidas
- Compartir contraseña con compañeros
- Eliminar datos sin autorización

---

## 🚨 Manejo de Emergencias

### Si un Vendedor necesita acceso temporal a Finanzas:
1. Propietario lo eleva temporalmente a Administrador
2. Vendedor realiza la tarea
3. Propietario lo regresa a Vendedor

### Si el Propietario no está disponible:
1. Administrador maneja operaciones diarias
2. Decisiones críticas se posponen
3. Contacto de emergencia con Propietario

### Si alguien olvida su contraseña:
1. Propietario crea nueva cuenta temporal
2. Usuario usa cuenta temporal
3. Propietario elimina cuenta antigua
4. Usuario cambia contraseña de cuenta temporal

---

## 📊 Resumen de Acceso

| Módulo | Vendedor | Administrador | Propietario |
|--------|----------|---------------|-------------|
| Pedidos | Ver, Crear, Editar | Ver, Crear, Editar, Eliminar | Ver, Crear, Editar, Eliminar |
| Calendario | Ver | Ver | Ver |
| Clientes | Ver, Crear, Editar | Ver, Crear, Editar | Ver, Crear, Editar |
| Finanzas | ❌ | ✅ Completo | ✅ Completo |
| Reportes | ❌ | ✅ Completo | ✅ Completo |
| Usuarios | ❌ | ✅ Limitado* | ✅ Completo |

*El Administrador puede crear/editar/eliminar Vendedores y Administradores, pero NO Propietarios

---

## ⚙️ Configuración Inicial Recomendada

### Empresa Pequeña (1-2 personas)
```
1 Propietario (dueño)
0-1 Vendedor (tiempo parcial o familiar)
```

### Empresa Mediana (3-5 personas)
```
1 Propietario (dueño)
1 Administrador (gerente o encargado)
2-3 Vendedores (personal de mostrador)
```

### Empresa Grande (6+ personas)
```
1-2 Propietarios (socios)
2-3 Administradores (gerentes por turno)
4+ Vendedores (equipo de ventas)
```

---

Esta estructura de permisos está diseñada para:
- ✅ Mantener la seguridad de los datos
- ✅ Facilitar la operación diaria
- ✅ Permitir crecimiento escalable
- ✅ Proteger información sensible
- ✅ Dar autonomía controlada al equipo
