# 🚀 Guía de Deployment - Pastelería CRM

## 📋 Pre-requisitos

1. **Node.js** instalado (versión 18 o superior)
   - Descarga desde: https://nodejs.org/
   
2. **Cuenta en Vercel**
   - Crea una cuenta gratuita en: https://vercel.com/signup

3. **Tu proyecto Supabase configurado**
   - Ya tienes uno en: https://supabase.com/dashboard

## 🔧 Instalación Local

### Paso 1: Descargar el código

Descarga todos los archivos del proyecto a una carpeta local en tu computadora.

### Paso 2: Abrir en Visual Studio Code

1. Abre Visual Studio Code
2. Menú `File` → `Open Folder`
3. Selecciona la carpeta donde descargaste el proyecto

### Paso 3: Instalar dependencias

Abre la terminal en VS Code (`Terminal` → `New Terminal`) y ejecuta:

```bash
npm install
```

Este proceso puede tardar unos minutos.

### Paso 4: Configurar variables de entorno

1. Copia el archivo `.env.example` y renómbralo a `.env`
2. Edita el archivo `.env` con tus datos de Supabase:

```env
VITE_SUPABASE_URL=https://mwogpzhixkcrxwhvxdgc.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13b2dwemhpeGtjcnh3aHZ4ZGdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5NTc3NjIsImV4cCI6MjA3NzUzMzc2Mn0.YFY4Wg2UxXBuPXIy9jWrcDCfmMo2rYBgxKz-wSHnD2E
VITE_SUPABASE_PROJECT_ID=mwogpzhixkcrxwhvxdgc
```

### Paso 5: Crear los iconos de PWA

1. Abre el archivo `public/icons/generate-placeholder-icons.html` en tu navegador
2. Descarga todos los iconos generados
3. Guárdalos en la carpeta `public/icons/`

O usa tus propios iconos (recomendado):
- Necesitas iconos PNG en estos tamaños: 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512
- Nómbralos como: `icon-72x72.png`, `icon-96x96.png`, etc.

### Paso 6: Probar localmente

En la terminal de VS Code, ejecuta:

```bash
npm run dev
```

La aplicación estará disponible en: http://localhost:3000

## 🌐 Deployment en Vercel

### Opción A: Deploy desde GitHub (Recomendado)

1. **Crear repositorio en GitHub:**
   - Ve a https://github.com/new
   - Crea un nuevo repositorio (puede ser privado)
   - Nombra el repositorio: `pasteleria-crm`

2. **Subir código a GitHub:**
   
   En la terminal de VS Code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/pasteleria-crm.git
   git push -u origin main
   ```

3. **Conectar con Vercel:**
   - Ve a https://vercel.com/new
   - Click en "Import Git Repository"
   - Selecciona tu repositorio de GitHub
   - Vercel detectará automáticamente que es un proyecto Vite

4. **Configurar variables de entorno en Vercel:**
   - En la sección "Environment Variables" agrega:
     - `VITE_SUPABASE_URL` = `https://mwogpzhixkcrxwhvxdgc.supabase.co`
     - `VITE_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (tu key completa)
     - `VITE_SUPABASE_PROJECT_ID` = `mwogpzhixkcrxwhvxdgc`

5. **Deploy:**
   - Click en "Deploy"
   - Espera 2-3 minutos
   - ¡Listo! Tu app estará en una URL como: `https://pasteleria-crm.vercel.app`

### Opción B: Deploy directo desde terminal

1. **Instalar Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login en Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Seguir las instrucciones:**
   - Confirma el nombre del proyecto
   - Selecciona tu cuenta
   - Confirma configuraciones

5. **Agregar variables de entorno:**
   ```bash
   vercel env add VITE_SUPABASE_URL
   vercel env add VITE_SUPABASE_ANON_KEY
   vercel env add VITE_SUPABASE_PROJECT_ID
   ```

6. **Deploy a producción:**
   ```bash
   vercel --prod
   ```

## 📱 Configurar PWA en tu tableta

Una vez desplegado en Vercel:

1. **Abre la URL en tu tableta Sunmi**
   - Ejemplo: `https://pasteleria-crm.vercel.app`

2. **Instalar como aplicación:**
   - En Chrome: Menú → "Agregar a pantalla de inicio"
   - Acepta la instalación
   - Aparecerá un ícono en tu pantalla principal

3. **Usar sin conexión:**
   - La PWA funciona offline después de la primera carga
   - Los datos se sincronizan cuando hay internet

## 🔄 Actualizar la aplicación

### Desde GitHub:
```bash
git add .
git commit -m "Actualización"
git push
```
Vercel desplegará automáticamente los cambios.

### Desde terminal:
```bash
vercel --prod
```

## ✅ Verificación

Después del deployment, verifica:

- [ ] La aplicación carga correctamente
- [ ] Puedes hacer login
- [ ] El formulario público funciona en: `https://tu-app.vercel.app/#/pedido`
- [ ] Los datos se guardan correctamente
- [ ] La PWA se puede instalar en móviles

## 🆘 Solución de problemas

### Error: "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Error en Vercel: "Build failed"
- Verifica que todas las variables de entorno estén configuradas
- Revisa los logs en Vercel Dashboard

### La PWA no se instala
- Verifica que todos los iconos estén en `public/icons/`
- Comprueba que `manifest.json` esté accesible
- Debe estar en HTTPS (Vercel lo hace automáticamente)

### Problemas con Supabase
- Verifica que las credenciales en `.env` sean correctas
- Asegúrate de que el Edge Function esté desplegado
- Revisa los logs en Supabase Dashboard

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs de Vercel
2. Revisa los logs de Supabase
3. Abre la consola del navegador (F12) para ver errores

## 🎉 ¡Listo!

Tu aplicación de pastelería ahora está disponible en línea y lista para usar en tu tableta Sunmi y cualquier dispositivo.
