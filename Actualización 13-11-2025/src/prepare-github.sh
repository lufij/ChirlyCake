#!/bin/bash

# Script para preparar y subir a GitHub
echo "🚀 Preparando proyecto para GitHub..."
echo ""

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check Git
echo "📦 Verificando Git..."
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version)
    echo -e "${GREEN}✓ Git instalado: ${GIT_VERSION}${NC}"
else
    echo -e "${RED}✗ Git no encontrado. Instala desde https://git-scm.com/${NC}"
    exit 1
fi

# Check if already initialized
echo ""
if [ -d ".git" ]; then
    echo -e "${YELLOW}⚠ Git ya está inicializado${NC}"
    echo "Repositorio actual:"
    git remote -v
else
    echo "🎬 Inicializando Git..."
    git init
    echo -e "${GREEN}✓ Git inicializado${NC}"
fi

# Check Git config
echo ""
echo "👤 Verificando configuración de Git..."
GIT_NAME=$(git config user.name)
GIT_EMAIL=$(git config user.email)

if [ -z "$GIT_NAME" ] || [ -z "$GIT_EMAIL" ]; then
    echo -e "${YELLOW}⚠ Configuración de Git incompleta${NC}"
    echo ""
    echo "Configura tu información:"
    echo "  git config --global user.name \"Tu Nombre\""
    echo "  git config --global user.email \"tuemail@example.com\""
    echo ""
else
    echo -e "${GREEN}✓ Nombre: ${GIT_NAME}${NC}"
    echo -e "${GREEN}✓ Email: ${GIT_EMAIL}${NC}"
fi

# Check sensitive files
echo ""
echo "🔒 Verificando archivos sensibles..."
WARNINGS=0

if [ -f ".env" ]; then
    if grep -q "^\.env$" .gitignore 2>/dev/null; then
        echo -e "${GREEN}✓ .env está en .gitignore${NC}"
    else
        echo -e "${RED}✗ ¡PELIGRO! .env NO está en .gitignore${NC}"
        ((WARNINGS++))
    fi
fi

if [ -d "node_modules" ]; then
    if grep -q "^node_modules" .gitignore 2>/dev/null; then
        echo -e "${GREEN}✓ node_modules está en .gitignore${NC}"
    else
        echo -e "${RED}✗ node_modules NO está en .gitignore${NC}"
        ((WARNINGS++))
    fi
fi

# Show what will be committed
echo ""
echo "📋 Archivos que se subirán a GitHub:"
echo ""

if [ -d ".git" ]; then
    # Si ya hay commits, muestra cambios
    if git rev-parse HEAD >/dev/null 2>&1; then
        git status --short
    else
        # Primer commit
        git add --dry-run -A | head -20
        echo "... (mostrando primeros 20 archivos)"
    fi
else
    echo "Ejecuta: git add . para ver la lista completa"
fi

# Check for important files
echo ""
echo "✅ Verificando archivos importantes..."
IMPORTANT_FILES=("package.json" "vite.config.ts" "tsconfig.json" "README.md" "App.tsx")
for file in "${IMPORTANT_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}  ✓ $file${NC}"
    else
        echo -e "${RED}  ✗ $file${NC}"
    fi
done

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ Todo listo para GitHub!${NC}"
    echo ""
    echo "Próximos pasos:"
    echo ""
    echo "1. Crea un repositorio en GitHub:"
    echo "   https://github.com/new"
    echo ""
    echo "2. Ejecuta estos comandos:"
    echo -e "${BLUE}"
    echo "   git add ."
    echo "   git commit -m \"Initial commit: Pastelería CRM\""
    echo "   git branch -M main"
    echo "   git remote add origin https://github.com/TU-USUARIO/pasteleria-crm.git"
    echo "   git push -u origin main"
    echo -e "${NC}"
    echo "3. Lee SUBIR_A_GITHUB.md para guía completa"
    echo ""
else
    echo -e "${RED}⚠ Se encontraron $WARNINGS advertencia(s)${NC}"
    echo ""
    echo "Corrige los problemas antes de subir a GitHub"
    echo ""
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
