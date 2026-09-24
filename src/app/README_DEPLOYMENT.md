# 🍰 Pastelería CRM - Sistema de Gestión Completo

Sistema integral de gestión para pastelería con CRM, pedidos, calendario, finanzas y PWA.

## 🌟 Características

- ✅ **Multi-usuario**: 3 roles (Vendedor, Administrador, Propietario)
- 📦 **Gestión de Pedidos**: Completa con estados y seguimiento
- 👥 **CRM de Clientes**: Base de datos de clientes
- 📅 **Calendario**: Vista de pedidos por fecha
- 💰 **Módulo Financiero**: Ingresos, egresos y reportes
- 📱 **PWA**: Instálala como app en tabletas y móviles
- 🔗 **Formulario Público**: Link para que clientes hagan pedidos
- 🌐 **Offline**: Funciona sin conexión después de primera carga

## 🚀 Inicio Rápido

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=https://mwogpzhixkcrxwhvxdgc.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13b2dwemhpeGtjcnh3aHZ4ZGdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5NTc3NjIsImV4cCI6MjA3NzUzMzc2Mn0.YFY4Wg2UxXBuPXIy9jWrcDCfmMo2rYBgxKz-wSHnD2E
VITE_SUPABASE_PROJECT_ID=mwogpzhixkcrxwhvxdgc
```

### 3. Generar iconos PWA

1. Abre `public/icons/generate-placeholder-icons.html` en tu navegador
2. Descarga todos los iconos (8 tamaños diferentes)
3. Guárdalos en `public/icons/`

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación estará disponible en: http://localhost:3000

### 5. Verificar configuración

```bash
npm run verify
```

## 📦 Build para producción

```bash
npm run build
```

Los archivos listos para producción estarán en la carpeta `dist/`

## 🌐 Deploy en Vercel

### Método 1: Desde GitHub (Recomendado)

1. Sube tu código a GitHub
2. Ve a https://vercel.com/new
3. Conecta tu repositorio
4. Agrega las variables de entorno
5. Click en "Deploy"

**Documentación completa**: Ver `DEPLOYMENT.md`

### Método 2: CLI

```bash
npm install -g vercel
vercel login
vercel
```

## 🔐 Configuración Inicial

Cuando abras la app por primera vez:

1. Verás la pantalla de configuración inicial
2. Crea el usuario propietario:
   - Nombre: Tu nombre
   - Teléfono: Tu número (será tu contraseña)
   - Email: Tu email

3. ¡Listo! Ya puedes crear vendedores y administradores

## 📱 Usar en Tableta Sunmi

1. Despliega la app en Vercel
2. Abre la URL en Chrome en tu tableta
3. Menú → "Agregar a pantalla de inicio"
4. La app se instalará como aplicación nativa

## 🔗 Formulario Público

Comparte este link con tus clientes:
```
https://tu-app.vercel.app/#/pedido
```

Los clientes podrán:
- Hacer pedidos sin registrarse
- Subir imágenes de referencia
- Los pedidos llegarán como "Pendiente de confirmación"
- El propietario asigna precio y confirma

## 📚 Documentación

- `DEPLOYMENT.md` - Guía completa de deployment
- `DEPLOYMENT_QUICK.md` - Guía rápida en 5 pasos
- `INSTRUCCIONES_USO.md` - Cómo usar la aplicación
- `PERMISOS_Y_ROLES.md` - Permisos de cada rol
- `PWA_FEATURES.md` - Características de la PWA

## 🛠 Tecnologías

- **Frontend**: React 18 + TypeScript + Vite
- **Estilos**: Tailwind CSS v4
- **UI**: Shadcn/ui + Radix UI
- **Backend**: Supabase (Edge Functions + Auth + Storage)
- **PWA**: Vite PWA Plugin + Workbox
- **Deploy**: Vercel

## 🗂 Estructura del Proyecto

```
pasteleria-crm/
├── components/          # Componentes React
│   ├── ui/             # Componentes Shadcn
│   ├── Dashboard.tsx   # Panel principal
│   ├── OrderList.tsx   # Lista de pedidos
│   ├── CalendarView.tsx # Vista de calendario
│   └── ...
├── lib/                # Librerías y utilidades
│   ├── api.ts          # Cliente API
│   └── supabase.ts     # Cliente Supabase
├── public/             # Archivos estáticos
│   ├── icons/          # Iconos PWA
│   └── manifest.json   # Manifiesto PWA
├── styles/             # Estilos globales
├── supabase/           # Backend Supabase
│   └── functions/      # Edge Functions
└── App.tsx             # Componente principal
```

## 🐛 Solución de problemas

### Error: Module not found
```bash
rm -rf node_modules package-lock.json
npm install
```

### La PWA no se instala
- Verifica que todos los iconos estén en `public/icons/`
- Debe estar en HTTPS (Vercel lo hace automáticamente)

### Problemas con Supabase
- Verifica las credenciales en `.env`
- Revisa que el Edge Function esté desplegado
- Revisa logs en Supabase Dashboard

## 📞 Soporte

- Abre la consola del navegador (F12) para ver errores
- Revisa los logs de Vercel
- Revisa los logs de Supabase

## 📄 Licencia

Este proyecto es de uso privado para tu pastelería.

---

**¡Disfruta tu nueva aplicación de gestión para pastelería!** 🎉🍰
