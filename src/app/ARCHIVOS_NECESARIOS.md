# 📁 Archivos Necesarios para el Deployment

## ✅ Archivos de Configuración (Ya incluidos)

Estos archivos ya están listos en tu proyecto:

- ✅ `package.json` - Dependencias y scripts
- ✅ `tsconfig.json` - Configuración TypeScript
- ✅ `vite.config.ts` - Configuración Vite
- ✅ `vercel.json` - Configuración Vercel
- ✅ `postcss.config.js` - Configuración PostCSS
- ✅ `.gitignore` - Archivos a ignorar
- ✅ `.env.example` - Ejemplo de variables
- ✅ `index.html` - HTML principal
- ✅ `main.tsx` - Punto de entrada React

## 📸 Imágenes Requeridas

### Iconos PWA (REQUERIDOS)

Debes generar estos iconos y guardarlos en `public/icons/`:

1. **Método 1: Generar placeholders** (Más rápido)
   - Abre `public/icons/generate-placeholder-icons.html` en Chrome
   - Descarga los 8 iconos generados
   - Guárdalos en `public/icons/`

2. **Método 2: Usar tus propios iconos** (Recomendado)
   - Crea un logo cuadrado para tu pastelería (512x512px)
   - Usa una herramienta online como https://realfavicongenerator.net/
   - Genera todos los tamaños necesarios
   - Descárgalos y guárdalos en `public/icons/`

**Tamaños necesarios:**
- `icon-72x72.png`
- `icon-96x96.png`
- `icon-128x128.png`
- `icon-144x144.png`
- `icon-152x152.png`
- `icon-192x192.png`
- `icon-384x384.png`
- `icon-512x512.png`

### Imágenes del Formulario Público

Estas imágenes ya están importadas en el código:

**Imagen de Turrón:**
- Archivo: `turronImage`
- Usado en: `PublicOrderForm.tsx`
- Asset ID: `f5fd82509aa844458a9987489ff3dc63ac9314e7.png`

**Imagen de Betún:**
- Archivo: `betunImage`
- Usado en: `PublicOrderForm.tsx`
- Asset ID: `d9437422728e1c5a0ff4c628c8a3f11c480e7d8f.png`

**Imagen de Fondant:**
- Archivo: `fondantImage`
- Usado en: `PublicOrderForm.tsx`
- Asset ID: `0546f288cc45540200ba187c6f98e672c890ef6c.png`

⚠️ **IMPORTANTE**: Estas imágenes usan el formato `figma:asset` que solo funciona en el entorno de Figma Make. Para deployment en Vercel, necesitas reemplazarlas.

### Cómo reemplazar las imágenes de Figma

1. **Descarga las 3 imágenes actuales:**
   - Turrón: Pastel con merengue de colores pastel
   - Betún: Pastel rosa con macarons
   - Fondant: Pastel con fondant arcoíris

2. **Guárdalas en la carpeta `public/images/`:**
   ```
   public/images/turron.jpg
   public/images/betun.jpg
   public/images/fondant.jpg
   ```

3. **Actualiza el componente PublicOrderForm.tsx:**

   Reemplaza estas líneas:
   ```typescript
   import turronImage from 'figma:asset/f5fd82509aa844458a9987489ff3dc63ac9314e7.png';
   import fondantImage from 'figma:asset/0546f288cc45540200ba187c6f98e672c890ef6c.png';
   import betunImage from 'figma:asset/d9437422728e1c5a0ff4c628c8a3f11c480e7d8f.png';
   ```

   Por estas:
   ```typescript
   import turronImage from '/images/turron.jpg';
   import fondantImage from '/images/fondant.jpg';
   import betunImage from '/images/betun.jpg';
   ```

## 📂 Estructura de Carpetas Final

```
public/
├── icons/
│   ├── icon-72x72.png
│   ├── icon-96x96.png
│   ├── icon-128x128.png
│   ├── icon-144x144.png
│   ├── icon-152x152.png
│   ├── icon-192x192.png
│   ├── icon-384x384.png
│   └── icon-512x512.png
├── images/
│   ├── turron.jpg
│   ├── betun.jpg
│   └── fondant.jpg
├── manifest.json
└── service-worker.js
```

## 🔍 Verificar antes de Deploy

Ejecuta este comando para verificar que todo esté listo:

```bash
npm run verify
```

## 🆘 Si faltan archivos

### Falta .env
```bash
cp .env.example .env
# Luego edita .env con tus credenciales
```

### Faltan node_modules
```bash
npm install
```

### Faltan iconos
1. Abre `public/icons/generate-placeholder-icons.html`
2. Descarga todos los iconos
3. Guárdalos en `public/icons/`

### Faltan imágenes del formulario
1. Descarga 3 fotos de pasteles (turrón, betún, fondant)
2. Guárdalas en `public/images/`
3. Actualiza las rutas en `PublicOrderForm.tsx`

## ✅ Checklist Rápido

- [ ] `public/icons/` tiene 8 archivos PNG
- [ ] `public/images/` tiene 3 archivos (turron, betun, fondant)
- [ ] `.env` existe y tiene las 3 variables
- [ ] `node_modules/` existe (si no: `npm install`)
- [ ] `PublicOrderForm.tsx` usa rutas locales (no `figma:asset`)

Una vez tengas todo, ¡estás listo para deployment! 🚀
