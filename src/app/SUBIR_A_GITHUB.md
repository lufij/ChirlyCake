# 📤 Cómo Subir tu Aplicación a GitHub

## 🎯 Objetivo
Subir tu código a GitHub para poder desplegarlo fácilmente en Vercel.

## ✅ Pre-requisitos

1. **Cuenta en GitHub**
   - Si no tienes: https://github.com/signup
   - Es gratis

2. **Git instalado**
   - Verifica: `git --version`
   - Si no está instalado: https://git-scm.com/downloads

3. **VS Code abierto con el proyecto**

## 📋 Paso a Paso

### Paso 1: Configurar Git (Solo primera vez)

Abre la terminal en VS Code y ejecuta:

```bash
# Configura tu nombre (usa tu nombre real)
git config --global user.name "Tu Nombre"

# Configura tu email (el mismo de GitHub)
git config --global user.email "tuemail@example.com"
```

### Paso 2: Crear Repositorio en GitHub

1. Ve a https://github.com/new
2. **Repository name**: `pasteleria-crm` (o el nombre que prefieras)
3. **Description**: `Sistema integral de gestión para pastelería`
4. Selecciona: **Private** (recomendado) o **Public**
5. ❌ **NO** selecciones "Add a README file"
6. ❌ **NO** selecciones "Add .gitignore"
7. ❌ **NO** selecciones "Choose a license"
8. Click en **"Create repository"**

### Paso 3: Inicializar Git en tu Proyecto

En la terminal de VS Code:

```bash
# Inicializa el repositorio
git init

# Verifica que .gitignore existe
ls -la | grep .gitignore
```

### Paso 4: Agregar todos los archivos

```bash
# Agrega todos los archivos al staging
git add .

# Verifica qué archivos se agregarán
git status
```

Deberías ver una lista de archivos en verde. Verifica que **NO** aparezcan:
- ❌ `node_modules/`
- ❌ `.env`
- ❌ `dist/`

Si aparecen, el `.gitignore` no está funcionando.

### Paso 5: Crear el primer commit

```bash
# Crea el commit inicial
git commit -m "Initial commit: Sistema de gestión de pastelería completo con PWA"
```

### Paso 6: Conectar con GitHub

Copia la URL de tu repositorio de GitHub. Debe verse así:
```
https://github.com/TU-USUARIO/pasteleria-crm.git
```

Luego ejecuta:

```bash
# Conecta con GitHub (reemplaza con TU URL)
git remote add origin https://github.com/TU-USUARIO/pasteleria-crm.git

# Verifica que se agregó correctamente
git remote -v
```

### Paso 7: Subir el código a GitHub

```bash
# Cambia la rama a 'main'
git branch -M main

# Sube el código
git push -u origin main
```

**Primera vez:** GitHub te pedirá autenticación:
- **Opción 1**: Usa GitHub CLI
- **Opción 2**: Usa Personal Access Token
- **Opción 3**: Usa GitHub Desktop

### Paso 8: Verificar en GitHub

1. Ve a tu repositorio en GitHub
2. Deberías ver todos tus archivos
3. Verifica que el README.md se muestre correctamente

## 🔐 Autenticación en GitHub

### Método 1: Personal Access Token (Recomendado)

1. Ve a https://github.com/settings/tokens
2. Click en "Generate new token" → "Generate new token (classic)"
3. **Note**: `Pastelería CRM`
4. **Expiration**: 90 días (o lo que prefieras)
5. Selecciona scope: **repo** (marca toda la sección)
6. Click en "Generate token"
7. **¡COPIA EL TOKEN!** (solo se muestra una vez)

Cuando Git te pida contraseña:
- **Username**: tu usuario de GitHub
- **Password**: pega el token (no tu contraseña de GitHub)

### Método 2: GitHub CLI (Más fácil)

```bash
# Instala GitHub CLI
# Windows (con winget):
winget install --id GitHub.cli

# Mac (con Homebrew):
brew install gh

# Autentica
gh auth login
```

Sigue las instrucciones en pantalla.

### Método 3: GitHub Desktop (Para principiantes)

1. Descarga GitHub Desktop: https://desktop.github.com/
2. Instala y abre
3. File → Add Local Repository
4. Selecciona la carpeta de tu proyecto
5. Publish repository

## ✅ Verificación

Después de subir, verifica que estos archivos estén en GitHub:

- ✅ `package.json`
- ✅ `vite.config.ts`
- ✅ `tsconfig.json`
- ✅ `vercel.json`
- ✅ `README.md`
- ✅ Carpeta `components/`
- ✅ Carpeta `lib/`
- ✅ Carpeta `public/`
- ✅ `.gitignore`

**NO** deben estar:
- ❌ `node_modules/`
- ❌ `.env`
- ❌ `dist/`

## 🔄 Actualizar el Repositorio Después

Cada vez que hagas cambios:

```bash
# Ver qué archivos cambiaron
git status

# Agregar todos los cambios
git add .

# Crear commit con mensaje descriptivo
git commit -m "Descripción de los cambios"

# Subir a GitHub
git push
```

### Ejemplos de mensajes de commit:

```bash
git commit -m "Agregar iconos PWA"
git commit -m "Actualizar imágenes del formulario público"
git commit -m "Corregir error en calendario"
git commit -m "Agregar nueva funcionalidad de reportes"
```

## 🚀 Siguiente Paso: Desplegar en Vercel

Una vez que tu código esté en GitHub:

1. Ve a https://vercel.com/new
2. Click en "Import Git Repository"
3. Selecciona tu repositorio `pasteleria-crm`
4. Agrega las variables de entorno:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_SUPABASE_PROJECT_ID`
5. Click en "Deploy"
6. ¡Espera 2-3 minutos y listo!

## 🆘 Problemas Comunes

### Error: "fatal: not a git repository"
```bash
git init
```

### Error: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/TU-USUARIO/pasteleria-crm.git
```

### Error: "Authentication failed"
- Usa un Personal Access Token en lugar de tu contraseña
- O usa GitHub CLI: `gh auth login`

### .env está en GitHub (¡PELIGRO!)
```bash
# Elimínalo de GitHub
git rm --cached .env
git commit -m "Remove .env from repository"
git push

# Asegúrate de que .gitignore tiene:
# .env
```

### node_modules está en GitHub
```bash
# Elimínalo de GitHub
git rm -r --cached node_modules
git commit -m "Remove node_modules from repository"
git push

# Asegúrate de que .gitignore tiene:
# node_modules
```

## 💡 Tips

- **Commits frecuentes**: Haz commit cada vez que completes una funcionalidad
- **Mensajes claros**: Describe qué cambios hiciste
- **Branches**: Para funcionalidades grandes, usa branches separadas
- **No subas secretos**: Nunca subas `.env` o archivos con API keys

## 📚 Comandos Git Útiles

```bash
# Ver estado actual
git status

# Ver historial de commits
git log --oneline

# Ver diferencias antes de commit
git diff

# Deshacer cambios (antes de commit)
git checkout -- archivo.tsx

# Ver ramas
git branch

# Crear nueva rama
git checkout -b nueva-funcionalidad

# Cambiar de rama
git checkout main

# Fusionar rama
git merge nueva-funcionalidad
```

## ✅ Checklist Final

Antes de continuar a Vercel, verifica:

- [ ] Código subido a GitHub
- [ ] `.env` NO está en GitHub
- [ ] `node_modules/` NO está en GitHub
- [ ] `README.md` se ve bien en GitHub
- [ ] Todos los archivos importantes están presentes
- [ ] El repositorio es privado (si contiene información sensible)

## 🎉 ¡Listo!

Tu código ahora está en GitHub y listo para desplegar en Vercel.

**Siguiente paso:** Ve a [DEPLOYMENT.md](DEPLOYMENT.md) para desplegar en Vercel.

---

**Enlaces útiles:**
- GitHub: https://github.com
- Guía Git: https://git-scm.com/doc
- GitHub Docs: https://docs.github.com
- Vercel: https://vercel.com
