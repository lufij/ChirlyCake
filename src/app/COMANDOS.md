# 📝 Comandos Útiles

## Desarrollo Local

### Instalar dependencias
```bash
npm install
```

### Iniciar servidor de desarrollo
```bash
npm run dev
```
La app estará en: http://localhost:3000

### Verificar configuración
```bash
npm run verify
```

### Build para producción
```bash
npm run build
```

### Preview del build
```bash
npm run preview
```

### Verificar TypeScript
```bash
npm run type-check
```

## Deployment

### Instalar Vercel CLI
```bash
npm install -g vercel
```

### Login en Vercel
```bash
vercel login
```

### Deploy (primera vez)
```bash
vercel
```

### Deploy a producción
```bash
vercel --prod
```

### Ver logs
```bash
vercel logs
```

### Configurar variables de entorno
```bash
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel env add VITE_SUPABASE_PROJECT_ID
```

### Ver lista de deployments
```bash
vercel ls
```

## Git

### Inicializar repositorio
```bash
git init
```

### Agregar todos los archivos
```bash
git add .
```

### Commit
```bash
git commit -m "Tu mensaje aquí"
```

### Conectar con GitHub
```bash
git remote add origin https://github.com/TU-USUARIO/pasteleria-crm.git
```

### Push a GitHub
```bash
git push -u origin main
```

### Actualizar
```bash
git add .
git commit -m "Actualización"
git push
```

## Limpieza

### Limpiar node_modules y reinstalar
```bash
rm -rf node_modules package-lock.json
npm install
```

### Limpiar build
```bash
rm -rf dist
npm run build
```

### Limpiar todo y empezar de nuevo
```bash
rm -rf node_modules package-lock.json dist
npm install
npm run build
```

## Supabase

### Ver logs del Edge Function
Ve a: https://supabase.com/dashboard/project/mwogpzhixkcrxwhvxdgc/functions/server/logs

### Probar Edge Function
```bash
curl https://mwogpzhixkcrxwhvxdgc.supabase.co/functions/v1/make-server-95aa99a4/health
```

## Vercel

### Dominio de la aplicación
```
https://tu-proyecto.vercel.app
```

### Dashboard de Vercel
```
https://vercel.com/dashboard
```

### Ver builds
```
https://vercel.com/TU-USUARIO/pasteleria-crm
```

## Recursos

- **Supabase Dashboard**: https://supabase.com/dashboard/project/mwogpzhixkcrxwhvxdgc
- **Vercel Dashboard**: https://vercel.com/dashboard
- **GitHub Repo**: https://github.com/TU-USUARIO/pasteleria-crm

## URLs Importantes

### En desarrollo
- App principal: http://localhost:3000
- Formulario público: http://localhost:3000/#/pedido

### En producción
- App principal: https://tu-proyecto.vercel.app
- Formulario público: https://tu-proyecto.vercel.app/#/pedido
