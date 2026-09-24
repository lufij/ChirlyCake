# 🚀 Deployment Rápido - 5 Pasos

## 1️⃣ Instalar dependencias
```bash
npm install
```

## 2️⃣ Crear archivo .env
Crea un archivo `.env` con:
```env
VITE_SUPABASE_URL=https://mwogpzhixkcrxwhvxdgc.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13b2dwemhpeGtjcnh3aHZ4ZGdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5NTc3NjIsImV4cCI6MjA3NzUzMzc2Mn0.YFY4Wg2UxXBuPXIy9jWrcDCfmMo2rYBgxKz-wSHnD2E
VITE_SUPABASE_PROJECT_ID=mwogpzhixkcrxwhvxdgc
```

## 3️⃣ Crear iconos
Abre `public/icons/generate-placeholder-icons.html` en tu navegador y descarga los iconos.

## 4️⃣ Probar localmente
```bash
npm run dev
```
Abre: http://localhost:3000

## 5️⃣ Deploy en Vercel

### Opción A: Desde la web
1. Ve a https://vercel.com/new
2. Conecta tu repositorio de GitHub
3. Agrega las variables de entorno (las mismas del .env)
4. Click en "Deploy"

### Opción B: Desde terminal
```bash
npm install -g vercel
vercel login
vercel
```

¡Listo! Tu app estará en: `https://tu-proyecto.vercel.app`
