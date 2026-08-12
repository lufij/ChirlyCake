#!/usr/bin/env node

import { existsSync, readdirSync } from 'fs';
import { join } from 'path';

console.log('🔍 Verificando configuración del proyecto...\n');

const checks = [];

// Check 1: package.json existe
checks.push({
  name: 'package.json',
  check: () => existsSync('package.json'),
  message: 'package.json encontrado'
});

// Check 2: node_modules existe
checks.push({
  name: 'node_modules',
  check: () => existsSync('node_modules'),
  message: 'Dependencias instaladas',
  error: 'Ejecuta: npm install'
});

// Check 3: .env existe
checks.push({
  name: '.env',
  check: () => existsSync('.env'),
  message: 'Variables de entorno configuradas',
  warning: 'Crea un archivo .env basado en .env.example'
});

// Check 4: iconos existen
const iconSizes = ['72x72', '96x96', '128x128', '144x144', '152x152', '192x192', '384x384', '512x512'];
checks.push({
  name: 'PWA Icons',
  check: () => {
    if (!existsSync('public/icons')) return false;
    const icons = readdirSync('public/icons');
    return iconSizes.every(size => icons.some(icon => icon.includes(size)));
  },
  message: 'Todos los iconos PWA encontrados',
  warning: 'Genera los iconos usando public/icons/generate-placeholder-icons.html'
});

// Check 5: TypeScript config
checks.push({
  name: 'tsconfig.json',
  check: () => existsSync('tsconfig.json'),
  message: 'TypeScript configurado'
});

// Check 6: Vite config
checks.push({
  name: 'vite.config.ts',
  check: () => existsSync('vite.config.ts'),
  message: 'Vite configurado'
});

// Check 7: Componentes principales
const components = ['App.tsx', 'main.tsx', 'components/Dashboard.tsx', 'lib/api.ts'];
checks.push({
  name: 'Componentes principales',
  check: () => components.every(c => existsSync(c)),
  message: 'Todos los componentes principales encontrados'
});

// Ejecutar checks
let errors = 0;
let warnings = 0;

checks.forEach(({ name, check, message, error, warning }) => {
  const passed = check();
  
  if (passed) {
    console.log(`✅ ${message}`);
  } else {
    if (error) {
      console.log(`❌ ${name}: ${error}`);
      errors++;
    } else if (warning) {
      console.log(`⚠️  ${name}: ${warning}`);
      warnings++;
    } else {
      console.log(`❌ ${name}: No encontrado`);
      errors++;
    }
  }
});

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

if (errors === 0 && warnings === 0) {
  console.log('🎉 ¡Todo listo! Puedes ejecutar:');
  console.log('   npm run dev    - Para desarrollo local');
  console.log('   npm run build  - Para crear build de producción');
  console.log('   vercel         - Para desplegar en Vercel\n');
} else {
  if (errors > 0) {
    console.log(`❌ ${errors} error(es) encontrado(s). Corrígelos antes de continuar.\n`);
  }
  if (warnings > 0) {
    console.log(`⚠️  ${warnings} advertencia(s). La app funcionará, pero se recomienda corregirlas.\n`);
  }
}
