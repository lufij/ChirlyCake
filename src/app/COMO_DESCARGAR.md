# 📥 Cómo Descargar y Preparar el Código

## 🎯 Objetivo

Descargar todos los archivos del proyecto para trabajar localmente en Visual Studio Code y desplegarlo en Vercel.

## 📋 Pre-requisitos

Antes de empezar, asegúrate de tener:

1. **Visual Studio Code** instalado
   - Descarga: https://code.visualstudio.com/

2. **Node.js** instalado (versión 18 o superior)
   - Descarga: https://nodejs.org/
   - Elige "LTS" (recomendado)

3. **Git** instalado (opcional pero recomendado)
   - Descarga: https://git-scm.com/

## 💾 Método 1: Descargar desde el entorno actual

Si estás viendo esto en el entorno de Figma Make:

1. **Descarga todos los archivos:**
   - Usa la función de exportación/descarga del entorno
   - Asegúrate de descargar TODOS los archivos y carpetas
   - Mantén la estructura de carpetas intacta

2. **Estructura que debes tener:**
   ```
   pasteleria-crm/
   ├── App.tsx
   ├── main.tsx
   ├── index.html
   ├── package.json
   ├── vite.config.ts
   ├── tsconfig.json
   ├── components/
   ├── lib/
   ├── public/
   ├── styles/
   ├── utils/
   └── ... (todos los demás archivos)
   ```

## 📂 Abrir en Visual Studio Code

1. **Abre VS Code**

2. **Abre la carpeta del proyecto:**
   - Menú `File` → `Open Folder...`
   - Selecciona la carpeta `pasteleria-crm`
   - Click en `Select Folder` / `Seleccionar carpeta`

3. **Abre la terminal integrada:**
   - Menú `Terminal` → `New Terminal`
   - O presiona: `` Ctrl+` `` (Windows/Linux) / `` Cmd+` `` (Mac)

## 🔧 Preparar el Proyecto

### Opción A: Usar el script automático

**En Windows:**
```powershell
.\prepare-deploy.ps1
```

**En Mac/Linux:**
```bash
chmod +x prepare-deploy.sh
./prepare-deploy.sh
```

### Opción B: Paso a paso manual

1. **Instalar dependencias:**
   ```bash
   npm install
   ```
   (Esto puede tardar 3-5 minutos)

2. **Crear archivo .env:**
   - Crea un nuevo archivo llamado `.env` (sin extensión)
   - Copia el contenido de `.env.example`
   - Pega en `.env` y ajusta los valores

3. **Generar iconos PWA:**
   - Abre `public/icons/generate-placeholder-icons.html` en Chrome
   - Descarga los 8 iconos
   - Guárdalos en `public/icons/`

4. **Agregar imágenes del formulario:**
   - Lee `NOTA_IMPORTANTE_IMAGENES.md`
   - Agrega 3 imágenes en `public/images/`

5. **Verificar:**
   ```bash
   npm run verify
   ```

6. **Probar localmente:**
   ```bash
   npm run dev
   ```
   Abre: http://localhost:3000

## 📦 Estructura Final

Después de preparar todo, deberías tener:

```
pasteleria-crm/
├── node_modules/          ✓ (generado por npm install)
├── dist/                  ✓ (generado por npm run build)
├── .env                   ✓ (creado por ti)
├── public/
│   ├── icons/
│   │   ├── icon-72x72.png      ✓
│   │   ├── icon-96x96.png      ✓
│   │   ├── icon-128x128.png    ✓
│   │   ├── icon-144x144.png    ✓
│   │   ├── icon-152x152.png    ✓
│   │   ├── icon-192x192.png    ✓
│   │   ├── icon-384x384.png    ✓
│   │   └── icon-512x512.png    ✓
│   └── images/
│       ├── turron.jpg     ✓
│       ├── betun.jpg      ✓
│       └── fondant.jpg    ✓
└── ... (resto de archivos)
```

## ✅ Verificación

Ejecuta estos comandos para verificar que todo esté bien:

```bash
# Verificar estructura
npm run verify

# Compilar TypeScript
npm run type-check

# Crear build de producción
npm run build

# Probar en local
npm run dev
```

Si todos pasan sin errores, ¡estás listo para deployment!

## 🚀 Siguiente Paso

Una vez que tengas todo funcionando localmente:

1. Lee `START_HERE.md` para el deployment
2. O salta directo a `DEPLOYMENT_QUICK.md` para la guía rápida

## 🆘 Problemas Comunes

### "npm: command not found"
- Node.js no está instalado correctamente
- Reinicia tu terminal después de instalar Node.js

### "Permission denied" (Mac/Linux)
```bash
sudo npm install
```

### Los iconos no se generan
- Asegúrate de abrir el HTML en Chrome (no otros navegadores)
- Haz click derecho → Inspeccionar para ver errores

### Las imágenes no cargan
- Verifica que los nombres sean exactos: `turron.jpg`, `betun.jpg`, `fondant.jpg`
- Verifica que estén en la carpeta correcta: `public/images/`

### "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build falla
- Lee los errores en la terminal
- Probablemente faltan archivos o hay errores en imports
- Revisa `NOTA_IMPORTANTE_IMAGENES.md`

## 💡 Tips

- Usa la terminal integrada de VS Code (más conveniente)
- No cierres la terminal mientras `npm run dev` está corriendo
- Presiona `Ctrl+C` para detener el servidor local
- Git bash funciona mejor que CMD en Windows
- Mantén las extensiones `.tsx`, `.ts`, `.jsx`, `.js` en los archivos

## 📞 Ayuda

Si tienes problemas:

1. Revisa la consola del terminal para errores
2. Lee `START_HERE.md` para más detalles
3. Revisa cada archivo `.md` en la raíz del proyecto
4. Verifica que Node.js versión sea 18+: `node -v`

---

**¡Siguiente paso:** Lee `START_HERE.md` para continuar con el deployment! 🚀
