#!/bin/bash

# Script para preparar el proyecto para deployment
echo "🚀 Preparando proyecto para deployment..."
echo ""

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check Node.js
echo "📦 Verificando Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓ Node.js instalado: ${NODE_VERSION}${NC}"
else
    echo -e "${RED}✗ Node.js no encontrado. Por favor instala Node.js 18+ desde https://nodejs.org/${NC}"
    exit 1
fi

# Check package.json
echo ""
echo "📄 Verificando archivos de configuración..."
if [ -f "package.json" ]; then
    echo -e "${GREEN}✓ package.json encontrado${NC}"
else
    echo -e "${RED}✗ package.json no encontrado${NC}"
    exit 1
fi

# Install dependencies
echo ""
echo "📥 Instalando dependencias..."
if npm install; then
    echo -e "${GREEN}✓ Dependencias instaladas correctamente${NC}"
else
    echo -e "${RED}✗ Error al instalar dependencias${NC}"
    exit 1
fi

# Check .env
echo ""
echo "🔐 Verificando variables de entorno..."
if [ -f ".env" ]; then
    echo -e "${GREEN}✓ Archivo .env encontrado${NC}"
else
    echo -e "${YELLOW}⚠ Archivo .env no encontrado${NC}"
    echo "  Creando .env desde .env.example..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo -e "${YELLOW}  ⚠ Por favor edita el archivo .env con tus credenciales${NC}"
    else
        echo -e "${RED}  ✗ .env.example no encontrado${NC}"
    fi
fi

# Check icons
echo ""
echo "🎨 Verificando iconos PWA..."
ICON_COUNT=0
for size in 72x72 96x96 128x128 144x144 152x152 192x192 384x384 512x512; do
    if [ -f "public/icons/icon-${size}.png" ]; then
        ((ICON_COUNT++))
    fi
done

if [ $ICON_COUNT -eq 8 ]; then
    echo -e "${GREEN}✓ Todos los iconos PWA encontrados (8/8)${NC}"
else
    echo -e "${YELLOW}⚠ Iconos PWA: ${ICON_COUNT}/8 encontrados${NC}"
    echo "  Por favor genera los iconos usando public/icons/generate-placeholder-icons.html"
fi

# Check images
echo ""
echo "🖼️  Verificando imágenes del formulario..."
IMAGE_COUNT=0
for img in turron betun fondant; do
    if [ -f "public/images/${img}.jpg" ] || [ -f "public/images/${img}.png" ]; then
        ((IMAGE_COUNT++))
        echo -e "${GREEN}  ✓ ${img}.jpg/png encontrado${NC}"
    else
        echo -e "${YELLOW}  ⚠ ${img}.jpg/png no encontrado${NC}"
    fi
done

if [ $IMAGE_COUNT -ne 3 ]; then
    echo -e "${YELLOW}  ⚠ Faltan imágenes del formulario público${NC}"
    echo "  Coloca las imágenes en public/images/ o usa URLs públicas"
    echo "  Lee NOTA_IMPORTANTE_IMAGENES.md para más detalles"
fi

# Run verify script
echo ""
echo "🔍 Ejecutando verificación completa..."
npm run verify

# Build test
echo ""
echo "🏗️  Probando build..."
if npm run build; then
    echo -e "${GREEN}✓ Build exitoso${NC}"
else
    echo -e "${RED}✗ Error en build${NC}"
    echo "  Revisa los errores arriba y corrígelos antes de desplegar"
    exit 1
fi

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Preparación completa!"
echo ""
echo "Próximos pasos:"
echo ""
echo "1. Verifica el archivo .env con tus credenciales"
echo "2. Asegúrate de tener los 8 iconos PWA en public/icons/"
echo "3. Asegúrate de tener las 3 imágenes en public/images/"
echo "4. Prueba localmente: npm run dev"
echo "5. Despliega en Vercel: vercel"
echo ""
echo "📚 Lee START_HERE.md para instrucciones completas"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
