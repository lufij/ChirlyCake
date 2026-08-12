# Script para preparar el proyecto para deployment (Windows)
Write-Host "🚀 Preparando proyecto para deployment..." -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "📦 Verificando Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node -v
    Write-Host "✓ Node.js instalado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js no encontrado. Por favor instala Node.js 18+ desde https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check package.json
Write-Host ""
Write-Host "📄 Verificando archivos de configuración..." -ForegroundColor Yellow
if (Test-Path "package.json") {
    Write-Host "✓ package.json encontrado" -ForegroundColor Green
} else {
    Write-Host "✗ package.json no encontrado" -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host ""
Write-Host "📥 Instalando dependencias..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Dependencias instaladas correctamente" -ForegroundColor Green
} else {
    Write-Host "✗ Error al instalar dependencias" -ForegroundColor Red
    exit 1
}

# Check .env
Write-Host ""
Write-Host "🔐 Verificando variables de entorno..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "✓ Archivo .env encontrado" -ForegroundColor Green
} else {
    Write-Host "⚠ Archivo .env no encontrado" -ForegroundColor Yellow
    Write-Host "  Creando .env desde .env.example..." -ForegroundColor Yellow
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "  ⚠ Por favor edita el archivo .env con tus credenciales" -ForegroundColor Yellow
    } else {
        Write-Host "  ✗ .env.example no encontrado" -ForegroundColor Red
    }
}

# Check icons
Write-Host ""
Write-Host "🎨 Verificando iconos PWA..." -ForegroundColor Yellow
$iconSizes = @("72x72", "96x96", "128x128", "144x144", "152x152", "192x192", "384x384", "512x512")
$iconCount = 0
foreach ($size in $iconSizes) {
    if (Test-Path "public/icons/icon-$size.png") {
        $iconCount++
    }
}

if ($iconCount -eq 8) {
    Write-Host "✓ Todos los iconos PWA encontrados (8/8)" -ForegroundColor Green
} else {
    Write-Host "⚠ Iconos PWA: $iconCount/8 encontrados" -ForegroundColor Yellow
    Write-Host "  Por favor genera los iconos usando public/icons/generate-placeholder-icons.html" -ForegroundColor Yellow
}

# Check images
Write-Host ""
Write-Host "🖼️  Verificando imágenes del formulario..." -ForegroundColor Yellow
$images = @("turron", "betun", "fondant")
$imageCount = 0
foreach ($img in $images) {
    $jpgPath = "public/images/$img.jpg"
    $pngPath = "public/images/$img.png"
    if ((Test-Path $jpgPath) -or (Test-Path $pngPath)) {
        $imageCount++
        Write-Host "  ✓ $img.jpg/png encontrado" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ $img.jpg/png no encontrado" -ForegroundColor Yellow
    }
}

if ($imageCount -ne 3) {
    Write-Host "  ⚠ Faltan imágenes del formulario público" -ForegroundColor Yellow
    Write-Host "  Coloca las imágenes en public/images/ o usa URLs públicas" -ForegroundColor Yellow
    Write-Host "  Lee NOTA_IMPORTANTE_IMAGENES.md para más detalles" -ForegroundColor Yellow
}

# Run verify script
Write-Host ""
Write-Host "🔍 Ejecutando verificación completa..." -ForegroundColor Yellow
npm run verify

# Build test
Write-Host ""
Write-Host "🏗️  Probando build..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Build exitoso" -ForegroundColor Green
} else {
    Write-Host "✗ Error en build" -ForegroundColor Red
    Write-Host "  Revisa los errores arriba y corrígelos antes de desplegar" -ForegroundColor Red
    exit 1
}

# Summary
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Preparación completa!" -ForegroundColor Green
Write-Host ""
Write-Host "Próximos pasos:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Verifica el archivo .env con tus credenciales"
Write-Host "2. Asegúrate de tener los 8 iconos PWA en public/icons/"
Write-Host "3. Asegúrate de tener las 3 imágenes en public/images/"
Write-Host "4. Prueba localmente: npm run dev"
Write-Host "5. Despliega en Vercel: vercel"
Write-Host ""
Write-Host "📚 Lee START_HERE.md para instrucciones completas" -ForegroundColor Cyan
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
