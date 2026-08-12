# Script para preparar y subir a GitHub (Windows)
Write-Host "🚀 Preparando proyecto para GitHub..." -ForegroundColor Cyan
Write-Host ""

# Check Git
Write-Host "📦 Verificando Git..." -ForegroundColor Yellow
try {
    $gitVersion = git --version
    Write-Host "✓ Git instalado: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Git no encontrado. Instala desde https://git-scm.com/" -ForegroundColor Red
    exit 1
}

# Check if already initialized
Write-Host ""
if (Test-Path ".git") {
    Write-Host "⚠ Git ya está inicializado" -ForegroundColor Yellow
    Write-Host "Repositorio actual:"
    git remote -v
} else {
    Write-Host "🎬 Inicializando Git..." -ForegroundColor Yellow
    git init
    Write-Host "✓ Git inicializado" -ForegroundColor Green
}

# Check Git config
Write-Host ""
Write-Host "👤 Verificando configuración de Git..." -ForegroundColor Yellow
$gitName = git config user.name
$gitEmail = git config user.email

if ([string]::IsNullOrEmpty($gitName) -or [string]::IsNullOrEmpty($gitEmail)) {
    Write-Host "⚠ Configuración de Git incompleta" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Configura tu información:"
    Write-Host '  git config --global user.name "Tu Nombre"'
    Write-Host '  git config --global user.email "tuemail@example.com"'
    Write-Host ""
} else {
    Write-Host "✓ Nombre: $gitName" -ForegroundColor Green
    Write-Host "✓ Email: $gitEmail" -ForegroundColor Green
}

# Check sensitive files
Write-Host ""
Write-Host "🔒 Verificando archivos sensibles..." -ForegroundColor Yellow
$warnings = 0

if (Test-Path ".env") {
    $gitignoreContent = Get-Content .gitignore -ErrorAction SilentlyContinue
    if ($gitignoreContent -match "^\.env$") {
        Write-Host "✓ .env está en .gitignore" -ForegroundColor Green
    } else {
        Write-Host "✗ ¡PELIGRO! .env NO está en .gitignore" -ForegroundColor Red
        $warnings++
    }
}

if (Test-Path "node_modules") {
    $gitignoreContent = Get-Content .gitignore -ErrorAction SilentlyContinue
    if ($gitignoreContent -match "node_modules") {
        Write-Host "✓ node_modules está en .gitignore" -ForegroundColor Green
    } else {
        Write-Host "✗ node_modules NO está en .gitignore" -ForegroundColor Red
        $warnings++
    }
}

# Show what will be committed
Write-Host ""
Write-Host "📋 Archivos que se subirán a GitHub:" -ForegroundColor Yellow
Write-Host ""

if (Test-Path ".git") {
    git status --short
} else {
    Write-Host "Ejecuta: git add . para ver la lista completa"
}

# Check for important files
Write-Host ""
Write-Host "✅ Verificando archivos importantes..." -ForegroundColor Yellow
$importantFiles = @("package.json", "vite.config.ts", "tsconfig.json", "README.md", "App.tsx")
foreach ($file in $importantFiles) {
    if (Test-Path $file) {
        Write-Host "  ✓ $file" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $file" -ForegroundColor Red
    }
}

# Summary
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

if ($warnings -eq 0) {
    Write-Host "✅ Todo listo para GitHub!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Próximos pasos:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. Crea un repositorio en GitHub:"
    Write-Host "   https://github.com/new"
    Write-Host ""
    Write-Host "2. Ejecuta estos comandos:" -ForegroundColor Cyan
    Write-Host "   git add ."
    Write-Host '   git commit -m "Initial commit: Pastelería CRM"'
    Write-Host "   git branch -M main"
    Write-Host "   git remote add origin https://github.com/TU-USUARIO/pasteleria-crm.git"
    Write-Host "   git push -u origin main"
    Write-Host ""
    Write-Host "3. Lee SUBIR_A_GITHUB.md para guía completa"
    Write-Host ""
} else {
    Write-Host "⚠ Se encontraron $warnings advertencia(s)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Corrige los problemas antes de subir a GitHub"
    Write-Host ""
}

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
