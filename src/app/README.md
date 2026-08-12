# 🍰 Pastelería CRM - Sistema Integral de Gestión

Sistema completo de gestión para tu pastelería con CRM, pedidos, calendario, finanzas y PWA instalable.

---

## 🚀 ¿Primera vez aquí? ¡EMPIEZA AQUÍ!

Lee estos archivos en orden:

1. 📥 **[COMO_DESCARGAR.md](COMO_DESCARGAR.md)** - Cómo descargar y abrir el proyecto en VS Code
2. 🟢 **[START_HERE.md](START_HERE.md)** - Guía de inicio rápido para deployment
3. ⚠️ **[NOTA_IMPORTANTE_IMAGENES.md](NOTA_IMPORTANTE_IMAGENES.md)** - Configurar imágenes (CRÍTICO antes de deploy)
4. ✅ **[CHECKLIST_DEPLOYMENT.md](CHECKLIST_DEPLOYMENT.md)** - Verifica que todo esté listo

**📚 Ver todo:** **[INDICE_DOCUMENTACION.md](INDICE_DOCUMENTACION.md)** - Índice completo de documentación

---

## ✨ Características Principales

### 📦 Gestión Completa de Pedidos
- ✅ Registro con fecha, hora y detalles completos
- ✅ 5 estados: Pendiente, En Producción, Listo, Entregado, Cancelado
- ✅ Control de pagos: anticipo, total y saldo pendiente
- ✅ Subida de imágenes de referencia
- ✅ **NUEVO**: Formulario público para que clientes hagan pedidos
- ✅ **NUEVO**: Visor de imágenes con zoom hasta 5x para tabletas/móviles

### 👥 CRM de Clientes
- ✅ Base de datos completa de clientes
- ✅ Historial de pedidos por cliente
- ✅ Búsqueda rápida
- ✅ Estadísticas de compras

### 📅 Calendario Inteligente
- ✅ Vista mensual, semanal y diaria
- ✅ Visualización de pedidos por fecha
- ✅ Filtros por estado
- ✅ Indicadores visuales de estados

### 💰 Control Financiero
- ✅ Registro de ingresos y egresos
- ✅ Categorización de transacciones
- ✅ Balance en tiempo real
- ✅ Reportes con gráficos
- ✅ Exclusivo para Propietario

### 📱 PWA Instalable
- ✅ **Instálala en tabletas Sunmi**
- ✅ Funciona como app nativa
- ✅ Icono en pantalla de inicio
- ✅ Funciona offline
- ✅ Actualizaciones automáticas

### 👥 Multi-usuario (3 Roles)
- **Propietario**: Acceso total + finanzas + gestión de usuarios
- **Administrador**: Gestión completa (sin finanzas)
- **Vendedor**: Ver pedidos y cambiar estados (sin editar)

Ver: **[PERMISOS_Y_ROLES.md](PERMISOS_Y_ROLES.md)**

---

## 🛠️ Tecnologías

- **Frontend**: React 18 + TypeScript + Vite
- **Estilos**: Tailwind CSS v4
- **UI**: Shadcn/ui + Radix UI
- **Backend**: Supabase (Edge Functions + Auth + Storage)
- **PWA**: Vite PWA Plugin + Workbox
- **Deploy**: Vercel

---

## 📦 Instalación y Deployment

### 1. Instalación Local

```bash
# Instalar dependencias
npm install

# Crear archivo .env
cp .env.example .env
# Edita .env con tus credenciales

# Iniciar desarrollo
npm run dev
```

Abre: http://localhost:3000

**Guía completa:** [COMO_DESCARGAR.md](COMO_DESCARGAR.md)

### 2. Configurar Archivos Necesarios

#### a) Iconos PWA (REQUERIDO)
```bash
# Abre en Chrome:
public/icons/generate-placeholder-icons.html

# Descarga los 8 iconos y guárdalos en public/icons/
```

#### b) Imágenes del Formulario (REQUERIDO)
```bash
# Coloca 3 imágenes en public/images/:
- turron.jpg
- betun.jpg
- fondant.jpg

# Actualiza imports en components/PublicOrderForm.tsx
```

**⚠️ CRÍTICO:** Lee [NOTA_IMPORTANTE_IMAGENES.md](NOTA_IMPORTANTE_IMAGENES.md)

### 3. Subir a GitHub

```bash
# Inicializar Git
git init
git add .
git commit -m "Initial commit: Pastelería CRM"

# Conectar con GitHub (crea el repo primero en github.com/new)
git remote add origin https://github.com/TU-USUARIO/pasteleria-crm.git
git branch -M main
git push -u origin main
```

**Guía completa:** [SUBIR_A_GITHUB.md](SUBIR_A_GITHUB.md)

### 4. Deployment en Vercel

```bash
# Opción 1: CLI
npm install -g vercel
vercel login
vercel

# Opción 2: Desde GitHub (Recomendado)
# 1. Ve a vercel.com/new
# 2. Conecta tu repo de GitHub
# 3. Agrega variables de entorno
# 4. Deploy!
```

**Variables de entorno en Vercel:**
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_SUPABASE_PROJECT_ID`

**Guías:**
- **Rápida**: [DEPLOYMENT_QUICK.md](DEPLOYMENT_QUICK.md)
- **Completa**: [DEPLOYMENT.md](DEPLOYMENT.md)

---

## 📱 Instalar en Tableta Sunmi

1. Despliega en Vercel
2. Abre la URL en Chrome en tu tableta
3. Menú → "Agregar a pantalla de inicio"
4. ¡Listo! Ya está instalada como app

**Guías de instalación:**
- [INSTALACION_PWA.md](INSTALACION_PWA.md) - Guía completa
- [INSTALACION_VISUAL_GUIDE.md](INSTALACION_VISUAL_GUIDE.md) - Con capturas
- [GUIA_INSTALACION_IMPRIMIBLE.md](GUIA_INSTALACION_IMPRIMIBLE.md) - Para imprimir

---

## 🔗 Formulario Público

Comparte este link con tus clientes para que hagan pedidos:

```
https://tu-proyecto.vercel.app/#/pedido
```

**Características:**
- ✅ Sin necesidad de registrarse
- ✅ Selección de tipo de cobertura (Turrón, Betún, Fondant)
- ✅ Subida de imágenes de referencia
- ✅ Los pedidos llegan como "Pendiente de confirmación"
- ✅ El propietario asigna precio y confirma automáticamente

**Documentación:**
- [FORMULARIO_PUBLICO.md](FORMULARIO_PUBLICO.md)
- [COMO_PROBAR_FORMULARIO.md](COMO_PROBAR_FORMULARIO.md)

---

## 📖 Uso de la Aplicación

### Primera vez (Configuración Inicial)

1. Abre la aplicación
2. Verás la pantalla de configuración inicial
3. Crea tu usuario propietario
4. ¡Listo para usar!

Ver: [SETUP.md](SETUP.md)

### Crear pedidos

1. Ve a "Pedidos" → "Nuevo Pedido"
2. Completa los datos del cliente
3. Agrega detalles del pedido
4. Registra anticipo
5. Sube imágenes de referencia
6. Guarda

### Gestionar clientes

1. Ve a "Clientes"
2. Busca o crea nuevo cliente
3. Ve historial de pedidos
4. Edita información

### Ver calendario

1. Ve a "Calendario"
2. Selecciona vista (mes/semana/día)
3. Filtra por estado
4. Click en un día para ver detalles

### Revisar finanzas (Solo Propietario)

1. Ve a "Finanzas"
2. Registra ingresos y egresos
3. Ve balance en tiempo real
4. Revisa reportes con gráficos

**Guía completa:** [INSTRUCCIONES_USO.md](INSTRUCCIONES_USO.md)

---

## ⚡ Comandos Útiles

```bash
npm run dev         # Desarrollo local
npm run build       # Build de producción
npm run preview     # Preview del build
npm run verify      # Verificar configuración
npm run type-check  # Verificar TypeScript
```

Ver todos: [COMANDOS.md](COMANDOS.md)

---

## 📂 Estructura del Proyecto

```
pasteleria-crm/
├── components/          # Componentes React
│   ├── ui/             # Componentes Shadcn
│   ├── Dashboard.tsx   # Panel principal
│   ├── OrderList.tsx   # Pedidos
│   ├── CalendarView.tsx # Calendario
│   ├── Finances.tsx    # Finanzas
│   └── PublicOrderForm.tsx # Formulario público
├── lib/                # Utilidades
│   ├── api.ts          # Cliente API
│   └── supabase.ts     # Cliente Supabase
├── public/             # Archivos estáticos
│   ├── icons/          # Iconos PWA (8 archivos)
│   ├── images/         # Imágenes formulario (3 archivos)
│   └── manifest.json   # Manifiesto PWA
├── supabase/           # Backend
│   └── functions/      # Edge Functions
├── styles/             # Estilos globales
├── App.tsx             # App principal
├── main.tsx            # Punto de entrada
└── package.json        # Dependencias
```

---

## 🆘 Solución de Problemas

### Error: "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Las imágenes del formulario no funcionan
**Lee:** [NOTA_IMPORTANTE_IMAGENES.md](NOTA_IMPORTANTE_IMAGENES.md)

### La PWA no se instala en tableta
**Lee:** [PWA_FAQ.md](PWA_FAQ.md)

### Problemas con el formulario público
**Lee:** [SOLUCION_PROBLEMAS_FORMULARIO.md](SOLUCION_PROBLEMAS_FORMULARIO.md)

### Error en Vercel deployment
- Verifica variables de entorno
- Verifica que todos los iconos estén en `public/icons/`
- Verifica rutas de imágenes en `PublicOrderForm.tsx`

---

## 📚 Documentación Completa

### 🔴 Documentos Críticos (Léelos primero)
1. [START_HERE.md](START_HERE.md) - Guía de inicio
2. [NOTA_IMPORTANTE_IMAGENES.md](NOTA_IMPORTANTE_IMAGENES.md) - Configurar imágenes
3. [DEPLOYMENT_QUICK.md](DEPLOYMENT_QUICK.md) - Deploy rápido

### 🟡 Documentos Importantes
4. [ARCHIVOS_NECESARIOS.md](ARCHIVOS_NECESARIOS.md) - Lista de archivos
5. [CHECKLIST_DEPLOYMENT.md](CHECKLIST_DEPLOYMENT.md) - Checklist completo
6. [INSTALACION_PWA.md](INSTALACION_PWA.md) - Instalar en tableta
7. [INSTRUCCIONES_USO.md](INSTRUCCIONES_USO.md) - Manual de uso

### 🟢 Referencias y Extras
8. [DEPLOYMENT.md](DEPLOYMENT.md) - Guía completa de deployment
9. [COMANDOS.md](COMANDOS.md) - Comandos útiles
10. [PERMISOS_Y_ROLES.md](PERMISOS_Y_ROLES.md) - Sistema de permisos
11. [PWA_FEATURES.md](PWA_FEATURES.md) - Características PWA
12. [FORMULARIO_PUBLICO.md](FORMULARIO_PUBLICO.md) - Documentación del formulario

**📚 Índice completo:** [INDICE_DOCUMENTACION.md](INDICE_DOCUMENTACION.md)

---

## 🎯 URLs y Dashboards

### Desarrollo Local
- **App**: http://localhost:3000
- **Formulario**: http://localhost:3000/#/pedido

### Producción (después del deploy)
- **App**: https://tu-proyecto.vercel.app
- **Formulario**: https://tu-proyecto.vercel.app/#/pedido

### Dashboards
- **Vercel**: https://vercel.com/dashboard
- **Supabase**: https://supabase.com/dashboard/project/mwogpzhixkcrxwhvxdgc

---

## 🎉 ¡Empieza Ahora!

### Para deployment:
1. Lee [START_HERE.md](START_HERE.md)
2. Sigue [DEPLOYMENT_QUICK.md](DEPLOYMENT_QUICK.md)
3. Verifica con [CHECKLIST_DEPLOYMENT.md](CHECKLIST_DEPLOYMENT.md)

### Para instalar en tableta:
1. Despliega en Vercel
2. Sigue [INSTALACION_PWA.md](INSTALACION_PWA.md)

### Para aprender a usar:
1. Lee [INSTRUCCIONES_USO.md](INSTRUCCIONES_USO.md)
2. Prueba con [DATOS_DE_PRUEBA.md](DATOS_DE_PRUEBA.md)

---

## 📄 Licencia

Este proyecto es de uso privado para tu pastelería.

---

**¿Preguntas?** Revisa el [INDICE_DOCUMENTACION.md](INDICE_DOCUMENTACION.md) para encontrar la guía que necesitas.

**¡Buena suerte con tu pastelería!** 🍰
