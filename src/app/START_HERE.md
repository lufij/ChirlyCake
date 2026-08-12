# 🚀 EMPIEZA AQUÍ - Guía Rápida de Deployment

¡Bienvenido! Esta es tu guía para desplegar tu aplicación de pastelería en Vercel.

## 📖 ¿Qué archivos leer?

1. **🟢 START_HERE.md** (este archivo) - Lee esto primero
2. **🟢 DEPLOYMENT_QUICK.md** - Guía rápida en 5 pasos
3. **🔵 DEPLOYMENT.md** - Guía completa y detallada
4. **🔵 ARCHIVOS_NECESARIOS.md** - Lista de archivos necesarios
5. **🟡 CHECKLIST_DEPLOYMENT.md** - Checklist para verificar todo
6. **🟡 COMANDOS.md** - Comandos útiles de referencia

## ⚡ Inicio Ultra-Rápido (5 minutos)

### 1. Instalar dependencias
```bash
npm install
```

### 2. Crear archivo .env
Crea un archivo llamado `.env` (sin extensión) con:
```
VITE_SUPABASE_URL=https://mwogpzhixkcrxwhvxdgc.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13b2dwemhpeGtjcnh3aHZ4ZGdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5NTc3NjIsImV4cCI6MjA3NzUzMzc2Mn0.YFY4Wg2UxXBuPXIy9jWrcDCfmMo2rYBgxKz-wSHnD2E
VITE_SUPABASE_PROJECT_ID=mwogpzhixkcrxwhvxdgc
```

### 3. Generar iconos PWA
1. Abre `public/icons/generate-placeholder-icons.html` en Chrome
2. Haz click en cada botón de descarga (8 iconos en total)
3. Guarda los archivos en `public/icons/`

### 4. Agregar imágenes del formulario
⚠️ **IMPORTANTE**: El formulario público necesita 3 imágenes.

**Opción A - Temporal (para probar rápido):**
Deja las imágenes actuales con `figma:asset` - funcionarán en desarrollo local

**Opción B - Producción (para Vercel):**
1. Descarga 3 fotos de pasteles
2. Guárdalas en `public/images/` como:
   - `turron.jpg`
   - `betun.jpg` 
   - `fondant.jpg`
3. Actualiza `components/PublicOrderForm.tsx`:

Busca estas líneas (alrededor de la línea 10):
```typescript
import turronImage from 'figma:asset/f5fd82509aa844458a9987489ff3dc63ac9314e7.png';
import fondantImage from 'figma:asset/0546f288cc45540200ba187c6f98e672c890ef6c.png';
import betunImage from 'figma:asset/d9437422728e1c5a0ff4c628c8a3f11c480e7d8f.png';
```

Reemplázalas por:
```typescript
import turronImage from '/images/turron.jpg';
import fondantImage from '/images/fondant.jpg';
import betunImage from '/images/betun.jpg';
```

### 5. Probar localmente
```bash
npm run dev
```
Abre: http://localhost:3000

Si todo funciona, ¡continúa al deployment!

## 🌐 Deploy en Vercel

### Opción 1: Desde la interfaz web (Más fácil)

1. **Sube tu código a GitHub:**
   - Crea un repositorio en https://github.com/new
   - En VS Code terminal:
     ```bash
     git init
     git add .
     git commit -m "Initial commit"
     git branch -M main
     git remote add origin https://github.com/TU-USUARIO/pasteleria-crm.git
     git push -u origin main
     ```

2. **Deploy en Vercel:**
   - Ve a https://vercel.com/new
   - Click en "Import Git Repository"
   - Selecciona tu repositorio
   - En "Environment Variables" agrega las 3 variables (las mismas del .env):
     - VITE_SUPABASE_URL
     - VITE_SUPABASE_ANON_KEY
     - VITE_SUPABASE_PROJECT_ID
   - Click en "Deploy"
   - ¡Espera 2-3 minutos!

### Opción 2: Desde terminal

```bash
npm install -g vercel
vercel login
vercel
```

Sigue las instrucciones y agrega las variables de entorno cuando te lo pida.

## ✅ Verificar que todo funciona

1. Abre tu URL de Vercel: `https://tu-proyecto.vercel.app`
2. Deberías ver la pantalla de login
3. El formulario público debe estar en: `https://tu-proyecto.vercel.app/#/pedido`

## 📱 Instalar en tu tableta

1. Abre la URL de Vercel en Chrome en tu tableta
2. Menú → "Agregar a pantalla de inicio"
3. ¡Ya está instalada como app!

## 🆘 Problemas Comunes

### "Cannot find module..."
```bash
rm -rf node_modules package-lock.json
npm install
```

### "Environment variable not defined"
- Verifica que el archivo `.env` existe
- Verifica que las variables en Vercel estén correctas

### Las imágenes del formulario no cargan
- Asegúrate de haber actualizado las rutas en `PublicOrderForm.tsx`
- Verifica que las 3 imágenes estén en `public/images/`

### Los iconos PWA no funcionan
- Verifica que los 8 iconos estén en `public/icons/`
- Usa exactamente los nombres: `icon-72x72.png`, etc.

## 📚 Próximos pasos

Una vez desplegado:

1. **Configura tu usuario propietario** (primera vez que abres la app)
2. **Comparte el link del formulario** con tus clientes
3. **Instala la app en tu tableta Sunmi**
4. **Lee la documentación de uso** en `INSTRUCCIONES_USO.md`

## 💡 Tips

- El primer deploy tarda 3-5 minutos
- Actualizaciones posteriores tardan 1-2 minutos
- Cada push a GitHub redespliega automáticamente
- La app funciona offline después de la primera carga
- Puedes compartir el formulario público sin que los clientes se registren

## 🎯 URLs Finales

Después del deployment, tendrás:

- **App principal**: `https://tu-proyecto.vercel.app`
- **Formulario público**: `https://tu-proyecto.vercel.app/#/pedido`
- **Vercel Dashboard**: `https://vercel.com/dashboard`
- **Supabase Dashboard**: `https://supabase.com/dashboard/project/mwogpzhixkcrxwhvxdgc`

---

## 🎉 ¡Eso es todo!

Si sigues estos pasos, en 10-15 minutos tendrás tu aplicación funcionando en producción.

**¿Dudas?** Lee `DEPLOYMENT.md` para la guía completa.

**¡Buena suerte con tu pastelería!** 🍰
